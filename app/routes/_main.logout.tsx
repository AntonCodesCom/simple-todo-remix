import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import sessions from '~/sessions';

export async function loader({ request }: LoaderFunctionArgs) {
  const { getSession, destroySession } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
