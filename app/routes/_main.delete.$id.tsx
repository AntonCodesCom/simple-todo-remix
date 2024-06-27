import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import env, { mode } from '~/env';
import { authSession } from '~/sessions';

// utility
async function deleteTodo(
  id: string,
  accessToken: string,
  apiBaseUrl: string,
): Promise<void> {
  const url = new URL(`todo/${id}`, apiBaseUrl);
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(
      'Unexpected error occurred while requesting DELETE /todo/:id.',
    );
  }
}

// utility
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// action
export async function action({ request, params }: ActionFunctionArgs) {
  const { isDev } = mode();
  isDev && (await delay(1)); // simulating latency
  const { id } = params;
  if (!id) {
    throw new Error('`id` parameter missing.');
  }
  const { apiBaseUrl } = env();
  const { getAuthSession, authSessionName } = authSession();
  const session = await getAuthSession(request.headers.get('Cookie'));
  const accessToken = session.get(authSessionName);
  await deleteTodo(id, accessToken, apiBaseUrl);
  return redirect('/');
}
