import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import { jwtDecode } from 'jwt-decode';
import { UnauthorizedException } from '~/Auth/exceptions';
import fetchMe from '~/Auth/utils/fetchMe';
import CommonErrorScreen from '~/Common/components/ErrorScreen';
import CommonLayout from '~/Common/components/Layout';
import env, { mode } from '~/env';
import { authSession, meSession } from '~/sessions';

// utility
function getAccessTokenExp(accessToken: string): number | null {
  try {
    const decoded = jwtDecode(accessToken);
    return decoded.exp ?? null;
  } catch (err) {
    return null;
  }
}

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const { getMeSession } = meSession();
  const _meSession = await getMeSession(cookieHeader);
  const me = _meSession.get('me');
  if (me) {
    return json({ username: me.username });
  }
  const { getAuthSession, destroyAuthSession, authSessionName } = authSession();
  const session = await getAuthSession(cookieHeader);
  const accessToken = session.get(authSessionName);
  const exp = getAccessTokenExp(accessToken);
  if (!exp || exp - Date.now() / 1000 < 86400) {
    // if access token will expire in less than 1 day
    // TODO: automatic session closing info alert
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroyAuthSession(session),
      },
    });
  }
  const { apiBaseUrl } = env();
  try {
    const { username } = await fetchMe(accessToken, apiBaseUrl);
    return json({ username });
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      return redirect('/login', {
        headers: {
          'Set-Cookie': await destroyAuthSession(session),
        },
      });
    } else {
      throw err;
    }
  }
}

// error boundary
export function ErrorBoundary() {
  const error = useRouteError();
  const { isDev } = mode();
  return (
    <CommonLayout>
      <CommonErrorScreen error={error} isDev={isDev} />
    </CommonLayout>
  );
}

/**
 * Main route layout component.
 */
export default function LayoutMain() {
  const { username } = useLoaderData<typeof loader>();
  return (
    <CommonLayout username={username}>
      <Outlet />
    </CommonLayout>
  );
}
