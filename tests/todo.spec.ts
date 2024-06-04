import test, { expect } from '@playwright/test';
import sessions from '../app/sessions';
import config from '~/config';
import arrayIdHash from '~/Common/utils/arrayIdHash';

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

  // asserting Todo list contains correct Todos
  const list = page.getByRole('list', { name: 'My Todos' });
  await expect(list).toBeVisible();
  const expectedIdHash = arrayIdHash(controlTodos);
  await expect(list).toHaveAttribute('data-idhash', expectedIdHash);
});
