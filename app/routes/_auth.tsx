import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { v4 } from 'uuid';
import validator from 'validator';
import { UnauthorizedException } from '~/Auth/exceptions';
import CommonLayout from '~/Common/components/Layout';
import CommonSession from '~/Common/components/Session';
import config from '~/config';
import sessions from '~/sessions';

// utility
async function fetchMe(
  accessToken: string,
  apiBaseUrl: string,
): Promise<{ username: string }> {
  const url = new URL('auth/me', apiBaseUrl);
  const res = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedException();
    } else {
      throw new Error(
        'Unexpected error occurred while fetching `GET /auth/me`.',
      );
    }
  }
  const data = await res.json();
  // TODO: response data validation
  return {
    username: data.username,
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { apiBaseUrl } = config();
  const { getSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get(sessionCookieName);
  const { username } = await fetchMe(accessToken, apiBaseUrl);
  return json({ username });
}

/**
 * Auth route layout component.
 */
export default function LayoutAuth() {
  const { username } = useLoaderData<typeof loader>();
  return (
    <CommonLayout>
      <CommonSession sessionId={username} /> {/* TODO: remove */}
      <Outlet />
    </CommonLayout>
  );
}
