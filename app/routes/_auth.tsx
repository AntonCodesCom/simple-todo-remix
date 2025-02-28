import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import CommonLayout from '~/Common/components/Layout';
import env from '~/env';
import { authSession } from '~/sessions';
import fetchMe from '~/Auth/utils/fetchMe';
import { UnauthorizedException } from '~/Auth/exceptions';
import CommonErrorBoundary from '~/Common/components/ErrorBoundary';

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getAuthSession, authSessionName } = authSession();
  const session = await getAuthSession(request.headers.get('Cookie'));
  const accessToken = session.get(authSessionName);
  if (!accessToken) {
    return null;
  }
  const { apiBaseUrl } = env();
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

// meta
export const meta: MetaFunction = () => {
  return [
    { title: 'Simple Todo' },
    {
      name: 'description',
      content: 'A Todo application built with Remix and NestJS.',
    },
  ];
};

// error boundary
export function ErrorBoundary() {
  return (
    <CommonLayout>
      <CommonErrorBoundary />
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
