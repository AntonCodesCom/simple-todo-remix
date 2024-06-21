import test, {
  APIRequestContext,
  Locator,
  Page,
  expect,
} from '@playwright/test';
import config from '~/config';
import arrayIdHash from '~/Common/utils/arrayIdHash';
import { faker } from '@faker-js/faker';
import generateSessionCookie from './utils/generateSessionCookie';
import fetchAccessToken from './utils/fetchAccessToken';
import { alice } from './fixtures/users';
import e2eConfig from './config';

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
    failOnStatusCode: true,
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
  let accessToken: string;

  const { actionTimeout } = e2eConfig;

  // before each
  test.beforeEach(async ({ page, request }) => {
    // data seeding
    const seedUrl = new URL('seed', apiBaseUrl).toString();
    await request.fetch(seedUrl, { method: 'POST', failOnStatusCode: true });
    // logging in (getting access token)
    const { username, password } = alice;
    accessToken = await fetchAccessToken({
      request,
      username,
      password,
      apiBaseUrl,
    });
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
    const existingListitemIds = await Promise.all(
      (await getTodoListItems(page)).map(
        async (x) => await x.getAttribute('id'),
      ),
    );
    const addedTodoLabel = faker.lorem.sentence();
    const addTodoForm = page.getByRole('form', { name: 'Add Todo' });
    await addTodoForm
      .getByRole('textbox', {
        name: 'Something to do...',
      })
      .fill(addedTodoLabel, { timeout: actionTimeout });
    await addTodoForm.dispatchEvent('submit');
    const list = getTodoList(page);
    const addedTodoCard = list.getByRole('listitem', { name: addedTodoLabel });
    await expect(addedTodoCard).toBeVisible();
    const addedTodoCardCheckbox = addedTodoCard.getByRole('checkbox', {
      name: 'Done',
    });
    await expect(addedTodoCardCheckbox).toBeChecked({ checked: false });
    // ensuring the `addedTodoCard` is a new element
    const addedTodoId = await addedTodoCard.getAttribute('id');
    expect(existingListitemIds).not.toContainEqual(addedTodoId);
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
    const todoToToggleCheckbox = todoToToggle.getByRole('checkbox', {
      name: 'Done',
    });
    const todoToToggleInitiallyChecked = await todoToToggleCheckbox.isChecked();
    const todoToToggleExpectedChecked = !todoToToggleInitiallyChecked;
    await todoToToggleCheckbox.click(); // TODO: dispatch "change" event instead
    // waiting for loading state to begin
    await page
      .locator(`[role=listitem][id="${todoToToggleId}"][aria-disabled=true]`)
      .waitFor();
    // waiting for loading state to finish
    await page
      .locator(`[role=listitem][id="${todoToToggleId}"][aria-disabled=false]`)
      .waitFor();
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
    await todoToEdit
      .getByRole('button', { name: 'Edit' })
      .click({ timeout: actionTimeout });
    const editForm = todoToEdit.getByRole('form', { name: 'Edit Todo' });
    const editedTodoLabel = faker.lorem.sentence();
    await editForm
      .getByRole('textbox', {
        name: 'Something to do...',
      })
      .fill(editedTodoLabel, { timeout: actionTimeout });
    await editForm.dispatchEvent('submit');
    // waiting for loading state to begin
    await page
      .locator(`[role=listitem][id="${todoToEditId}"][aria-disabled=true]`)
      .waitFor();
    // waiting for loading state to finish
    await page
      .locator(`[role=listitem][id="${todoToEditId}"][aria-disabled=false]`)
      .waitFor();
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
    const todoToDeleteId = await todoToDelete.getAttribute('id');
    await todoToDelete
      .getByRole('button', { name: 'Delete' })
      .click({ timeout: actionTimeout });
    const deleteDialog = page.getByRole('dialog', {
      name: 'Delete this Todo?',
    });
    await deleteDialog
      .getByRole('button', { name: 'Yes' })
      .click({ timeout: actionTimeout });
    // `controlTodoToDelete` is supposed to be the same element as `todoToDelete`
    const controlTodoToDelete = page.locator(`id=${todoToDeleteId}`);
    await expect(controlTodoToDelete).toBeHidden();
    // asserting the deleted Todo does not exist on the backend
    const backendTodos = await fetchBackendTodos(
      request,
      apiBaseUrl,
      accessToken,
    );
    const backendDeletedTodoIndex = backendTodos.findIndex(
      (x: any) => x.id === todoToDeleteId,
    );
    expect(backendDeletedTodoIndex).toEqual(-1);
  });
});
