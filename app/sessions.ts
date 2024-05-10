import { createCookieSessionStorage } from '@remix-run/node';
import config from './config';
import envMode from './envMode';

export default function sessions() {
  const { isDev, isProd } = envMode;
  const {
    sessionCookieName,
    sessionCookieSecret,
    allowSessionCookieWithoutHttps,
  } = config();
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
