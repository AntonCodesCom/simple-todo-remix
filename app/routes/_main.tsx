import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { v4 } from 'uuid';
import validator from 'validator';
import CommonLayout from '~/Common/components/Layout';
import CommonSession from '~/Common/components/Session';
import sessions from '~/sessions';

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession, commitSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const sessionIdParam = url.searchParams.get('sessionId');
  if (sessionIdParam && validator.isUUID(sessionIdParam)) {
    // if session ID is set via search params
    // then overriding existing session ID if any
    session.set(sessionCookieName, sessionIdParam);
    return json(
      { sessionId: sessionIdParam },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      },
    );
  }
  let sessionId = session.get(sessionCookieName) as string;
  if (sessionId) {
    // if session ID has already been set
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
