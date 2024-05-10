import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { v4 } from 'uuid';
import CommonLayout from '~/Common/components/Layout';
import sessions from '~/sessions';

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession, commitSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const sessionId = session.get(sessionCookieName);
  if (sessionId) {
    return new Response();
  }
  session.set(sessionCookieName, v4());
  return new Response(null, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

/**
 * Main route layout component.
 */
export default function LayoutMain() {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}
