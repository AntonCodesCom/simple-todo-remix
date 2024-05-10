import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { v4 } from 'uuid';
import CommonLayout from '~/Common/components/Layout';
import CommonSession from '~/Common/components/Session';
import sessions from '~/sessions';

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession, commitSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  let sessionId = session.get(sessionCookieName) as string;
  if (sessionId) {
    return json({ sessionId });
  }
  sessionId = v4();
  session.set(sessionCookieName, sessionId);
  return json(
    { sessionId },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
}

/**
 * Main route layout component.
 */
export default function LayoutMain() {
  const { sessionId } = useLoaderData<typeof loader>();
  return (
    <CommonLayout>
      <CommonSession sessionId={sessionId} />
      <Outlet />
    </CommonLayout>
  );
}
