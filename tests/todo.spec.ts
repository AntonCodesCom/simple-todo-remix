import test, { expect } from '@playwright/test';
import sessions from '../app/sessions';
import config from '~/config';
import arrayIdHash from '~/Common/utils/arrayIdHash';
import { faker } from '@faker-js/faker';

// utility
async function generateSessionCookie(userId: string) {
  const { getSession, commitSession, sessionCookieName } = sessions();
  const session = await getSession();
  session.set(sessionCookieName, userId);
  const rawCookie = await commitSession(session);
  const parts = rawCookie.split(';')[0].split('=');
  return {
    name: parts[0],
    value: parts[1],
  };
}

//
// e2e test
//
test('Todo', async ({ page, request }) => {
  // defining data
  const { baseUrl, apiBaseUrl } = config();
  const aliceUserId = '878664be-1926-44ab-9c77-eb5d803369be'; // fixture

  // data seeding
  const seedUrl = new URL('seed', apiBaseUrl).toString();
  await request.fetch(seedUrl, { method: 'POST', failOnStatusCode: true });

  // requesting control data
  const getTodoUrl = new URL('todo', apiBaseUrl).toString();
  const res = await request.fetch(getTodoUrl, {
    headers: {
      Authorization: `Bearer ${aliceUserId}`,
    },
  });
  const controlTodos = await res.json();
  expect(controlTodos.length).toBeGreaterThanOrEqual(3);

  // setting user session (via cookies)
  const sessionCookie = await generateSessionCookie(aliceUserId);
  await page.context().addCookies([{ ...sessionCookie, url: baseUrl }]);

  // visiting the page
  await page.goto('/');

  // DISPLAYING TODOS
  // asserting Todo list contains correct Todos
  const list = page.getByRole('list', { name: 'My Todos' });
  await expect(list).toBeVisible();
  const controlIdHash = arrayIdHash(controlTodos);
  await expect(list).toHaveAttribute('data-idhash', controlIdHash);

  // ADDING A TODO
  const addedTodoLabel = 'E2E added Todo label.';
  const addTodoForm = page.getByRole('form', { name: 'Add Todo' });
  await expect(addTodoForm).toBeVisible();
  const addTodoFormInput = addTodoForm.getByRole('textbox', {
    name: 'Something to do...',
  });
  await expect(addTodoFormInput).toBeVisible();
  await addTodoFormInput.fill(addedTodoLabel);
  await addTodoForm.dispatchEvent('submit');
  const addedTodoCard = list.getByRole('listitem', { name: addedTodoLabel });
  await expect(addedTodoCard).toBeVisible();
  const addedTodoCardCheckbox = addedTodoCard.getByRole('checkbox', {
    name: addedTodoLabel,
  });
  await expect(addedTodoCardCheckbox).toBeChecked({ checked: false });

  // to be used in further testing
  const listitems = await list
    .getByRole('listitem')
    .filter({ hasNotText: addedTodoLabel })
    .all();
  // const pickedListItems = faker.helpers.arrayElements(listitems, 3);
  const pickedListItems = listitems;

  // TOGGLING A TODO
  const todoToToggle = pickedListItems[0];
  const todoToToggleId = await todoToToggle.getAttribute('id');
  const todoToToggleCheckbox = todoToToggle.getByRole('checkbox');
  const todoToToggleInitiallyChecked = await todoToToggleCheckbox.isChecked();
  const todoToToggleExpectedChecked = !todoToToggleInitiallyChecked;
  await todoToToggleCheckbox.click(); // TODO: "change" event
  await expect(todoToToggleCheckbox).toBeChecked({
    checked: todoToToggleExpectedChecked,
  });

  // EDITING A TODO
  const todoToEdit = pickedListItems[1];
  const todoToEditId = await todoToEdit.getAttribute('id');
  const editButton = todoToEdit.getByRole('button', { name: 'Edit' });
  await expect(editButton).toBeVisible();
  await editButton.click();
  const editForm = todoToEdit.getByRole('form', { name: 'Edit Todo' });
  await expect(editForm).toBeVisible();
  const editFormInput = editForm.getByRole('textbox', {
    name: 'Something to do...',
  });
  await expect(editFormInput).toBeVisible();
  const editedTodoLabel = 'E2E edited Todo label.';
  await editFormInput.fill(editedTodoLabel);
  await editForm.dispatchEvent('submit');
  const editedTodo = list.getByRole('listitem', { name: editedTodoLabel });
  await expect(editedTodo).toBeVisible();
  // asserting `editedTodo` and `todoToEdit` are the same element
  expect(await editedTodo.getAttribute('id')).toEqual(todoToEditId);

  // DELETING A TODO
  const todoToDelete = pickedListItems[2];
  const todoToDeleteId = await todoToDelete.getAttribute('id');
  const deleteButton = todoToEdit.getByRole('button', { name: 'Delete' });
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
  const deleteDialog = page.getByRole('dialog', { name: 'Delete this Todo?' });
  await expect(deleteDialog).toBeVisible();
  await deleteDialog.getByRole('button', { name: 'Yes' }).click();

  // BACKEND DATA POST-VERIFICATION
  const res2 = await request.fetch(getTodoUrl, {
    headers: {
      Authorization: `Bearer ${aliceUserId}`,
    },
  });
  const controlTodos2 = await res2.json();
  // verifying updated Todo array
  const controlIdHash2 = arrayIdHash(controlTodos2);
  expect(controlIdHash2).not.toEqual(controlIdHash);
  await expect(list).toHaveAttribute('data-idhash', controlIdHash2);
  // verifying added Todo exists
  const controlAddedTodoIndex = controlTodos2.findIndex(
    (x: any) => x.label === addedTodoLabel,
  );
  expect(controlAddedTodoIndex).not.toEqual(-1);
  // verifying toggled Todo's "done" state is updated
  const controlTodoToToggle = controlTodos2.find(
    (x: any) => x.id === todoToToggleId,
  );
  expect(controlTodoToToggle.done).toEqual(todoToToggleExpectedChecked);
  // verifying edited Todo has the new label
  const controlEditedTodo = controlTodos2.find(
    (x: any) => x.id === todoToEditId,
  );
  expect(controlEditedTodo.label).toEqual(editedTodoLabel);
});
