import { authSession } from '~/sessions';

export default async function generateSessionCookie(accessToken: string) {
  const { getAuthSession, commitAuthSession, authSessionName } = authSession();
  const session = await getAuthSession();
  session.set(authSessionName, accessToken);
  const rawCookie = await commitAuthSession(session);
  const parts = rawCookie.split(';')[0].split('=');
  return {
    name: parts[0],
    value: parts[1],
  };
}
