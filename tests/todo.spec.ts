import test, { expect } from '@playwright/test';
import sessions from '../app/sessions';
import config from '~/config';
import arrayIdHash from '~/Common/utils/arrayIdHash';
import { faker } from '@faker-js/faker';
import md5 from 'md5';

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

  // setting user session (via cookies)
  const sessionCookie = await generateSessionCookie(aliceUserId);
  await page.context().addCookies([{ ...sessionCookie, url: baseUrl }]);

  // visiting the page
  await page.goto('/');

  // DISPLAYING TODOS
  // asserting Todo list contains correct Todos
  const list = page.getByRole('list', { name: 'My Todos' });
  await expect(list).toBeVisible();
  const expectedIdHash = arrayIdHash(controlTodos);
  await expect(list).toHaveAttribute('data-idhash', expectedIdHash);

  // ADDING TODO
  const newUniqueLabel = md5(controlTodos.map((x: any) => x.label).join());
  const addTodoForm = page.getByRole('form', { name: 'Add Todo' });
  await expect(addTodoForm).toBeVisible();
  const addTodoFormInput = addTodoForm.getByRole('textbox', {
    name: 'Something to do...',
  });
  await expect(addTodoFormInput).toBeVisible();
  await addTodoFormInput.fill(newUniqueLabel);
  await addTodoForm.dispatchEvent('submit');
  const addedTodoCard = list.getByRole('listitem', { name: newUniqueLabel });
  await expect(addedTodoCard).toBeVisible();
  const addedTodoCardCheckbox = addedTodoCard.getByRole('checkbox', {
    name: newUniqueLabel,
  });
  await expect(addedTodoCardCheckbox).toBeChecked({ checked: false });

  // to be used in further testing
  const listitems = await list.getByRole('listitem').all();

  // TOGGLING TODO
  const todoToToggle = faker.helpers.arrayElement(listitems);
  const todoToToggleId = await todoToToggle.getAttribute('id');
  const todoToToggleName =
    controlTodos.find((x: any) => x.id === todoToToggleId)?.label ??
    newUniqueLabel;
  // TODO: get `todoToToggle` accessible name and assign it to `todoToToggleName`
  const todoToToggleCheckbox = todoToToggle.getByRole('checkbox', {
    name: todoToToggleName,
  });
  const initiallyChecked = await todoToToggleCheckbox.isChecked();
  await todoToToggleCheckbox.click(); // TODO: "change" event
  await expect(todoToToggleCheckbox).toBeChecked({
    checked: !initiallyChecked,
  });
});
