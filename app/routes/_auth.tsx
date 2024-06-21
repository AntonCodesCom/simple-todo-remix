import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import CommonLayout from '~/Common/components/Layout';
import config from '~/config';
import sessions from '~/sessions';
import fetchMe from '~/Auth/utils/fetchMe';

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { apiBaseUrl } = config();
  const { getSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get(sessionCookieName);
  const { username } = await fetchMe(accessToken, apiBaseUrl);
  return json({ username });
  // TODO: redirect to '/' if user is already authenticated
}

// TODO: error boundary

/**
 * Auth route layout component.
 */
export default function LayoutAuth() {
  const { username } = useLoaderData<typeof loader>();
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}
