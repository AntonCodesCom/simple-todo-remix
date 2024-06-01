import test, { expect } from '@playwright/test';
import sessions from '../app/sessions';

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
test('Todo', async ({ page }) => {
  // defining data
  const url = 'http://localhost:5173/'; // TODO: env
  const aliceUserId = '878664be-1926-44ab-9c77-eb5d803369be'; // fixture

  // TODO: data seeding
  // TODO: GET /todo backend request

  // setting user session (via cookies)
  const sessionCookie = await getSessionCookie(aliceUserId);
  await page.context().addCookies([{ ...sessionCookie, url }]);

  // visiting the page
  await page.goto(url);

  // asserting todo list is on the page
  const list = page.getByRole('list', { name: 'My Todos' });
  await expect(list).toBeVisible();
});
