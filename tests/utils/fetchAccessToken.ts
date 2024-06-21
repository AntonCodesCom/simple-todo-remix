import { APIRequestContext } from '@playwright/test';

interface Params {
  request: APIRequestContext;
  username: string;
  password: string;
  apiBaseUrl: string;
}

/**
 * Requests access token from the login endpoint for given user credentials.
 * @param request
 * @param username
 * @param password
 * @param apiBaseUrl
 * @returns access token
 */
export default async function fetchAccessToken({
  request,
  username,
  password,
  apiBaseUrl,
}: Params): Promise<string> {
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
