import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import AuthLogin from '~/Auth/components/Login';
import { UnauthorizedException } from '~/Auth/exceptions';
import AuthLoggedInSchema, {
  authLoggedInSchema,
} from '~/Auth/types/LoggedInSchema';
import { authLoginSchema } from '~/Auth/types/LoginSchema';
import env from '~/env';
import envMode from '~/envMode';
import sessions from '~/sessions';

// utility
async function fetchLogin(
  username: string,
  password: string,
  apiBaseUrl: string,
): Promise<AuthLoggedInSchema> {
  const body = JSON.stringify({ username, password });
  const url = new URL('auth/login', apiBaseUrl);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedException();
    }
    throw new Error('HTTP error occurred while fetching `POST /auth/login`.');
  }
  const data = await res.json();
  return authLoggedInSchema.parse(data);
}

// utility
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// action
export async function action({ request }: ActionFunctionArgs) {
  const { isDev } = envMode();
  isDev && (await delay(1)); // simulating latency
  const form = await request.formData();
  const data = authLoginSchema.parse({
    username: form.get('username'),
    password: form.get('password'),
  });
  const { username, password } = data;
  const { apiBaseUrl } = env();
  try {
    const { accessToken } = await fetchLogin(username, password, apiBaseUrl);
    const { getSession, commitSession, sessionCookieName } = sessions();
    const session = await getSession(request.headers.get('Cookie'));
    session.set(sessionCookieName, accessToken);
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      return json({ incorrectCredentials: true, lastSubmittedAt: Date.now() });
    }
    throw err;
  }
}

/**
 * `/login` route component.
 */
export default function RouteLogin() {
  const actionData = useActionData<typeof action>();
  return <AuthLogin {...actionData} />;
}
