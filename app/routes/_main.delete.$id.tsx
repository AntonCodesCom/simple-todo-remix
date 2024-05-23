import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import config from '~/config';
import sessions from '~/sessions';

// utility
async function deleteTodo(
  id: string,
  userId: string,
  apiBaseUrl: string,
): Promise<void> {
  const url = new URL(`todo/${id}`, apiBaseUrl);
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userId}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(
      'Unexpected error occurred while requesting DELETE /todo/:id.',
    );
  }
}

// action
export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) {
    throw new Error('`id` parameter missing.');
  }
  const { apiBaseUrl } = config();
  const { getSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get(sessionCookieName);
  await deleteTodo(id, userId, apiBaseUrl);
  return redirect('/');
}
