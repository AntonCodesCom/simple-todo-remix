import test, { expect } from '@playwright/test';
import config from '~/config';
import generateSessionCookie from './utils/generateSessionCookie';
import { alice } from './fixtures/users';
import fetchAccessToken from './utils/fetchAccessToken';

//
// e2e test
//
test.describe('Auth', () => {
  // config
  const { baseUrl, apiBaseUrl } = config();

  // data seeding
  test.beforeEach(async ({ request }) => {
    // data seeding
    const seedUrl = new URL('seed', apiBaseUrl).toString();
    await request.fetch(seedUrl, { method: 'POST', failOnStatusCode: true });
  });

  // restricted routes
  test.describe('invalid access token', () => {
    test('/', async ({ page }) => {
      // setting auth session (via cookies)
      const invalidAccessToken = 'INVALID_ACCESS_TOKEN';
      const sessionCookie = await generateSessionCookie(invalidAccessToken);
      await page.context().addCookies([{ ...sessionCookie, url: baseUrl }]);
      // visiting the page
      await page.goto('/');
      await expect(page).toHaveURL('/login');
    });
  });

  // guest only routes
  test.describe('user logged in', () => {
    test('/login', async ({ page, request }) => {
      const { username, password } = alice;
      const accessToken = await fetchAccessToken({
        request,
        username,
        password,
        apiBaseUrl,
      });
      const sessionCookie = await generateSessionCookie(accessToken);
      await page.context().addCookies([{ ...sessionCookie, url: baseUrl }]);
      await page.goto('/login');
      await expect(page).toHaveURL('/');
    });
  });

  test('login', () => {
    test.fixme();
  });
});
