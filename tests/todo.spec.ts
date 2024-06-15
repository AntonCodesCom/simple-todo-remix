import test, {
  APIRequestContext,
  Locator,
  Page,
  expect,
} from '@playwright/test';
import sessions from '../app/sessions';
import config from '~/config';
import arrayIdHash from '~/Common/utils/arrayIdHash';
import { faker } from '@faker-js/faker';

// config
test.describe.configure({ mode: 'serial' });

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

// utility
async function fetchBackendTodos(
  request: APIRequestContext,
  apiBaseUrl: string,
  accessToken: string,
): Promise<any[]> {
  // requesting control data
  const getTodoUrl = new URL('todo', apiBaseUrl).toString();
  const res = await request.fetch(getTodoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return (await res.json()) as any[];
}

// utility
function getTodoList(page: Page): Locator {
  return page.getByRole('list', { name: 'My Todos' });
}

// utility
async function getTodoListItems(page: Page): Promise<Locator[]> {
  const list = getTodoList(page);
  return await list.getByRole('listitem').all();
}

//
// e2e test
//
test.describe('Todo', () => {
  // values used throughout the test suite
  const { baseUrl, apiBaseUrl } = config();
  const aliceUserId = '878664be-1926-44ab-9c77-eb5d803369be'; // fixture
  const accessToken = aliceUserId; // TODO: update when new auth system is introduced

  // before each
  test.beforeEach(async ({ page, request }) => {
    // data seeding
    const seedUrl = new URL('seed', apiBaseUrl).toString();
    await request.fetch(seedUrl, { method: 'POST', failOnStatusCode: true });
    // setting user session (via cookies)
    const sessionCookie = await generateSessionCookie(accessToken);
    await page.context().addCookies([{ ...sessionCookie, url: baseUrl }]);
    // visiting the page
    await page.goto('/');
  });

  // displaying
  test('displaying', async ({ page, request }) => {
    // requesting control data
    const backendTodos = await fetchBackendTodos(
      request,
      apiBaseUrl,
      accessToken,
    );
    expect(backendTodos.length).toBeGreaterThanOrEqual(1);
    // asserting the Todo list contains correct Todos via a checksum
    const list = getTodoList(page);
    await expect(list).toBeVisible();
    const expectedIdHash = arrayIdHash(backendTodos);
    await expect(list).toHaveAttribute('data-idhash', expectedIdHash);
  });

  // adding
  test('adding', async ({ page, request }) => {
    const addedTodoLabel = faker.lorem.sentence();
    const addTodoForm = page.getByRole('form', { name: 'Add Todo' });
    await expect(addTodoForm).toBeVisible();
    const addTodoFormInput = addTodoForm.getByRole('textbox', {
      name: 'Something to do...',
    });
    await expect(addTodoFormInput).toBeVisible();
    await addTodoFormInput.fill(addedTodoLabel);
    await addTodoForm.dispatchEvent('submit');
    const list = getTodoList(page);
    const addedTodoCard = list.getByRole('listitem', { name: addedTodoLabel });
    await expect(addedTodoCard).toBeVisible();
    const addedTodoCardCheckbox = addedTodoCard.getByRole('checkbox');
    await expect(addedTodoCardCheckbox).toBeChecked({ checked: false });
    // asserting the added Todo exists on the backend
    const backendTodos = await fetchBackendTodos(
      request,
      apiBaseUrl,
      accessToken,
    );
    const backendAddedTodoIndex = backendTodos.findIndex(
      (x: any) => x.label === addedTodoLabel,
    );
    expect(backendAddedTodoIndex).not.toEqual(-1);
  });

  // toggling
  test('toggling', async ({ page, request }) => {
    const listitems = await getTodoListItems(page);
    const todoToToggle = faker.helpers.arrayElement(listitems);
    const todoToToggleId = await todoToToggle.getAttribute('id');
    const todoToToggleCheckbox = todoToToggle.getByRole('checkbox');
    const todoToToggleInitiallyChecked = await todoToToggleCheckbox.isChecked();
    const todoToToggleExpectedChecked = !todoToToggleInitiallyChecked;
    await todoToToggleCheckbox.click(); // TODO: dispatch "change" event instead
    await expect(todoToToggleCheckbox).toBeChecked({
      checked: todoToToggleExpectedChecked,
    });
    // asserting the target Todo's "done" state has been changed on the backend
    const backendTodos = await fetchBackendTodos(
      request,
      apiBaseUrl,
      accessToken,
    );
    const controlTodoToToggle = backendTodos.find(
      (x: any) => x.id === todoToToggleId,
    );
    expect(controlTodoToToggle.done).toEqual(todoToToggleExpectedChecked);
  });

  // editing
  test('editing', async ({ page, request }) => {
    const listitems = await getTodoListItems(page);
    const todoToEdit = faker.helpers.arrayElement(listitems);
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
    const editedTodoLabel = faker.lorem.sentence();
    await editFormInput.fill(editedTodoLabel);
    await editForm.dispatchEvent('submit');
    await expect(todoToEdit).toHaveAccessibleName(editedTodoLabel);
    // asserting the target Todo has its label updated on the backend
    const backendTodos = await fetchBackendTodos(
      request,
      apiBaseUrl,
      accessToken,
    );
    const controlEditedTodo = backendTodos.find(
      (x: any) => x.id === todoToEditId,
    );
    expect(controlEditedTodo.label).toEqual(editedTodoLabel);
  });

  // deletion
  test('deletion', async ({ page, request }) => {
    const listitems = await getTodoListItems(page);
    const todoToDelete = faker.helpers.arrayElement(listitems);
    // const todoToDeleteId = await todoToDelete.getAttribute('id');
    await todoToDelete
      .getByRole('button', { name: 'Delete' })
      .click({ timeout: 987 });
    const deleteDialog = page.getByRole('dialog', {
      name: 'Delete this Todo?',
    });
    await deleteDialog
      .getByRole('button', { name: 'Yes' })
      .click({ timeout: 987 });
  });
});
