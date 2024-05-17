import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import config from '~/config';
import sessions from '~/sessions';

// utility
async function addTodo(
  label: string,
  userId: string,
  apiBaseUrl: string,
): Promise<void> {
  const url = new URL('todo', apiBaseUrl);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userId}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) {
    throw new Error('Unexpected error occurred requesting POST /todo.');
  }
}

// action
export async function action({ request }: ActionFunctionArgs) {
  const { apiBaseUrl } = config();
  const { getSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get(sessionCookieName);
  const formData = await request.formData();
  const label = formData.get('label');
  if (!label || typeof label !== 'string') {
    throw new Error('`label` must be a non-empty string.');
  }
  await addTodo(label, userId, apiBaseUrl);
  return redirect('/');
}
