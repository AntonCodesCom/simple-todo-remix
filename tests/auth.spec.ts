import test, { expect } from '@playwright/test';
import config from '~/config';
import generateSessionCookie from './utils/generateSessionCookie';
import { alice } from './fixtures/users';
import fetchAccessToken from './utils/fetchAccessToken';
import e2eConfig from './config';
import { faker } from '@faker-js/faker';

//
// e2e test
//
test.describe('Auth', () => {
  // config
  const { baseUrl, apiBaseUrl } = config();
  const { actionTimeout } = e2eConfig;

  // data seeding
  test.beforeEach(async ({ request }) => {
    const seedUrl = new URL('seed', apiBaseUrl).toString();
    await request.fetch(seedUrl, { method: 'POST', failOnStatusCode: true });
  });

  // when the auth session (access token) is invalid
  test.describe('auth-restricted routes', () => {
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

  // when user has already logged in
  test.describe('guest-only routes', () => {
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

    test('/signup', async ({ page, request }) => {
      const { username, password } = alice;
      const accessToken = await fetchAccessToken({
        request,
        username,
        password,
        apiBaseUrl,
      });
      const sessionCookie = await generateSessionCookie(accessToken);
      await page.context().addCookies([{ ...sessionCookie, url: baseUrl }]);
      await page.goto('/signup');
      await expect(page).toHaveURL('/');
    });
  });

  // login flow
  test('login flow', async ({ page }) => {
    await page.goto('/login');
    const loginForm = page.getByRole('form', { name: 'Login' });
    const { username, password } = alice;
    await loginForm
      .getByRole('textbox', { name: 'Username' })
      .fill(username, { timeout: actionTimeout });
    await loginForm
      .getByRole('textbox', { name: 'Password' })
      .fill(password, { timeout: actionTimeout });
    await loginForm
      .getByRole('button', { name: 'Login' })
      .click({ timeout: actionTimeout }); // TODO: dispatch "submit" event instead
    await expect(page).toHaveURL('/');
    // TODO: assert logout button
  });

  // signup flow
  test('signup flow', async ({ page, request }) => {
    // clearing database
    const seedUrl = new URL('seed', apiBaseUrl).toString();
    await request.fetch(seedUrl, { method: 'DELETE', failOnStatusCode: true });
    // visiting the page
    await page.goto('/signup');
    const signupForm = page.getByRole('form', { name: 'Sign Up' });
    const username = faker.person.firstName().toLowerCase();
    const password = 'User1111$';
    await signupForm
      .getByRole('textbox', { name: 'Username' })
      .fill(username, { timeout: actionTimeout });
    await signupForm
      .getByRole('textbox', { name: 'Password' })
      .fill(password, { timeout: actionTimeout });
    await signupForm
      .getByRole('button', { name: 'Sign Up' })
      .click({ timeout: actionTimeout }); // TODO: dispatch "submit" event instead
    await expect(page).toHaveURL('/');
    const logoutButton = page.getByRole('link', {
      name: `Logout (${username})`,
    });
    await expect(logoutButton).toBeVisible();
  });
});
