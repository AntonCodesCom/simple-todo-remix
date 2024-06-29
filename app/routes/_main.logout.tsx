import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { authSession, meSession } from '~/sessions';

export async function loader({ request }: LoaderFunctionArgs) {
  const { getAuthSession, destroyAuthSession } = authSession();
  const { getMeSession, destroyMeSession } = meSession();
  const cookieHeader = request.headers.get('Cookie');
  const session = await getAuthSession(cookieHeader);
  const _meSession = await getMeSession(cookieHeader);
  const headers = new Headers();
  headers.append('Set-Cookie', await destroyAuthSession(session));
  headers.append('Set-Cookie', await destroyMeSession(_meSession));
  return redirect('/login', { headers });
}
