import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { jwtDecode } from 'jwt-decode';
import { UnauthorizedException } from '~/Auth/exceptions';
import fetchMe from '~/Auth/utils/fetchMe';
import CommonLayout from '~/Common/components/Layout';
import config from '~/config';
import sessions from '~/sessions';

// utility
function getAccessTokenExp(accessToken: string): number | undefined {
  const decoded = jwtDecode(accessToken);
  return decoded.exp;
}

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession, destroySession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get(sessionCookieName);
  if (!accessToken) {
    return redirect('/login');
  }
  const exp = getAccessTokenExp(accessToken);
  if (!exp || exp - Date.now() / 1000 < 86400) {
    // if access token will expire in less than 1 day
    // TODO: automatic session closing info alert
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }
  const { apiBaseUrl } = config();
  try {
    const { username } = await fetchMe(accessToken, apiBaseUrl);
    return json({ username });
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      return redirect('/login', {
        headers: {
          'Set-Cookie': await destroySession(session),
        },
      });
    } else {
      throw err;
    }
  }
}

// TODO: error boundary

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
