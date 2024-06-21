import test, { expect } from '@playwright/test';
import config from '~/config';
import generateSessionCookie from './utils/generateSessionCookie';

//
// e2e test
//
test.describe('Auth', () => {
  // config
  const { baseUrl, apiBaseUrl } = config();

  // for all restricted routes
  test.describe('invalid access token', () => {
    test('/', async ({ page, request }) => {
      // data seeding
      const seedUrl = new URL('seed', apiBaseUrl).toString();
      await request.fetch(seedUrl, { method: 'POST', failOnStatusCode: true });
      // setting auth session (via cookies)
      const invalidAccessToken = 'INVALID_ACCESS_TOKEN';
      const sessionCookie = await generateSessionCookie(invalidAccessToken);
      await page.context().addCookies([{ ...sessionCookie, url: baseUrl }]);
      // visiting the page
      await page.goto('/');
      await expect(page).toHaveURL('/login');
    });
  });
});
