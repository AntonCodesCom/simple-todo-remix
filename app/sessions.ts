import { createCookieSessionStorage } from '@remix-run/node';
import env, { mode } from './env';

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

/**
 *
 * @deprecated
 * @use `authSession`
 */
export default function sessions() {
  const { isDev, isProd } = mode();
  const { sessionCookieSecret, allowSessionCookieWithoutHttps } = env();
  const sessionCookieName = 'session';
  const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
      cookie: {
        name: sessionCookieName,
        httpOnly: true,
        path: '/',
        sameSite: isDev ? 'strict' : 'lax', // TODO: env var
        secrets: [sessionCookieSecret],
        secure: isProd || !allowSessionCookieWithoutHttps,
        maxAge: 60 * 60 * 24 * 7 * 4, // 4 weeks
      },
    });
  return { getSession, commitSession, destroySession, sessionCookieName };
}
