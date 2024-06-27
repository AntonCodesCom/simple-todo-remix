import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet, useRouteError } from '@remix-run/react';
import CommonLayout from '~/Common/components/Layout';
import config from '~/config';
import sessions from '~/sessions';
import fetchMe from '~/Auth/utils/fetchMe';
import { UnauthorizedException } from '~/Auth/exceptions';
import envMode from '~/envMode';
import CommonErrorScreen from '~/Common/components/ErrorScreen';

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

// error boundary
export function ErrorBoundary() {
  const error = useRouteError();
  const { isDev } = envMode();
  return (
    <CommonLayout>
      <CommonErrorScreen error={error} isDev={isDev} />
    </CommonLayout>
  );
}

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
