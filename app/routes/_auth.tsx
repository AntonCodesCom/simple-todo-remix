import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import CommonLayout from '~/Common/components/Layout';
import config from '~/config';
import sessions from '~/sessions';
import fetchMe from '~/Auth/utils/fetchMe';
import { UnauthorizedException } from '~/Auth/exceptions';

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get(sessionCookieName);
  if (!accessToken) {
    return null;
  }
  const { apiBaseUrl } = config();
  try {
    await fetchMe(accessToken, apiBaseUrl);
    return redirect('/');
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      return null;
    } else {
      throw err;
    }
  }
}

// TODO: error boundary

/**
 * Auth route layout component.
 */
export default function LayoutAuth() {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}
