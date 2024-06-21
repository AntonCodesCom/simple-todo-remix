import { APIRequestContext } from '@playwright/test';

/**
 * Requests the login endpoint.
 * @param request
 * @param username
 * @param password
 * @param apiBaseUrl
 * @returns access token
 */
export default async function login(
  request: APIRequestContext,
  username: string,
  password: string,
  apiBaseUrl: string,
): Promise<string> {
  const url = new URL('auth/login', apiBaseUrl).toString();
  const res = await request.fetch(url, {
    method: 'POST',
    data: JSON.stringify({ username, password }),
    headers: {
      'Content-Type': 'application/json',
    },
    failOnStatusCode: true,
  });
  return (await res.json()).accessToken;
}
