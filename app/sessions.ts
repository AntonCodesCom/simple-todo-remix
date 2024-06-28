import { createCookieSessionStorage } from '@remix-run/node';
import env, { mode } from './env';
import AuthMe from './Auth/types/Me';

// type
interface MeSessionProps {
  me: AuthMe;
}

/**
 * User state session factory.
 *
 * Provides utilities for storing and managing temporary user
 * information in cookies (valid during browser session).
 */
export function meSession() {
  const { isDev, isProd } = mode();
  const { sessionCookieSecret, allowSessionCookieWithoutHttps } = env();
  const meSessionName = 'me';
  const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<MeSessionProps>({
      cookie: {
        name: meSessionName,
        httpOnly: true,
        path: '/',
        sameSite: isDev ? 'strict' : 'lax', // TODO: env var
        secrets: [sessionCookieSecret],
        secure: isProd || !allowSessionCookieWithoutHttps,
      },
    });
  return {
    getMeSession: getSession,
    commitMeSession: commitSession,
    destroyMeSession: destroySession,
    meSessionName,
  };
}

/**
 * Auth session factory function.
 *
 * Provides utilities for storing and managing access token in cookies.
 */
export function authSession() {
  const { isDev, isProd } = mode();
  const { sessionCookieSecret, allowSessionCookieWithoutHttps } = env();
  const authSessionName = 'session';
  const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
      cookie: {
        name: authSessionName,
        httpOnly: true,
        path: '/',
        sameSite: isDev ? 'strict' : 'lax', // TODO: env var
        secrets: [sessionCookieSecret],
        secure: isProd || !allowSessionCookieWithoutHttps,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    });
  return {
    getAuthSession: getSession,
    commitAuthSession: commitSession,
    destroyAuthSession: destroySession,
    authSessionName,
  };
}
