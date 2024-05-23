import { ActionFunctionArgs, redirect } from '@remix-run/node';
import config from '~/config';
import sessions from '~/sessions';

// action
export async function action({ request }: ActionFunctionArgs) {
  const { apiBaseUrl } = config();
  const { getSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get(sessionCookieName);
  const formData = await request.formData();
  // const label = formData.get('label');
  // if (!label || typeof label !== 'string') {
  //   throw new Error('`label` must be a non-empty string.');
  // }
  const done = formData.get('done');
  if (done !== 'true' && done !== 'false') {
    throw new Error('`done` must be either "true" or "false".');
  }

  // await addTodo(label, userId, apiBaseUrl);
  return redirect('/');
}
