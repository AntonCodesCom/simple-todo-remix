import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { authSession } from '~/sessions';

export async function loader({ request }: LoaderFunctionArgs) {
  const { getAuthSession, destroyAuthSession } = authSession();
  const session = await getAuthSession(request.headers.get('Cookie'));
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroyAuthSession(session),
    },
  });
}
