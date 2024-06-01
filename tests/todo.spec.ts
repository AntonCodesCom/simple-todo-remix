import test, { expect } from '@playwright/test';
import sessions from '../app/sessions';
import config from '~/config';

// utility
async function getSessionCookie(userId: string) {
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

  // TODO: GET /todo backend request

  // setting user session (via cookies)
  const sessionCookie = await getSessionCookie(aliceUserId);
  await page.context().addCookies([{ ...sessionCookie, url: baseUrl }]);

  // visiting the page
  await page.goto('/');

  // asserting todo list is on the page
  const list = page.getByRole('list', { name: 'My Todos' });
  await expect(list).toBeVisible();
});
