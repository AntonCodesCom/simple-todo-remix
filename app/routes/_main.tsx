import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { UnauthorizedException } from '~/Auth/exceptions';
import fetchMe from '~/Auth/utils/fetchMe';
import CommonLayout from '~/Common/components/Layout';
import CommonSession from '~/Common/components/Session';
import config from '~/config';
import sessions from '~/sessions';

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get(sessionCookieName);
  if (!accessToken) {
    return redirect('/login');
  }
  const { apiBaseUrl } = config();
  try {
    const { username } = await fetchMe(accessToken, apiBaseUrl);
    return json({ username });
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      return redirect('/login');
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
      <CommonSession sessionId={username} /> {/* TODO: remove */}
      <Outlet />
    </CommonLayout>
  );
}
