import { ActionFunctionArgs, redirect } from '@remix-run/node';
import config from '~/config';
import sessions from '~/sessions';

interface Params {
  id: string;
  userId: string;
  apiBaseUrl: string;
  label?: string;
  done?: boolean;
}

// utility
async function updateTodo({
  id,
  userId,
  label,
  done,
  apiBaseUrl,
}: Params): Promise<void> {
  const url = new URL(`todo/${id}`, apiBaseUrl);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userId}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ label, done }),
  });
  if (!res.ok) {
    throw new Error(
      'Unexpected error occurred while requesting PATCH /todo/:id.',
    );
  }
}

// utility
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// action
export async function action({ request, params }: ActionFunctionArgs) {
  await delay(1); // simulating latency
  const { todoId } = params;
  if (!todoId) {
    throw new Error('`todoId` parameter missing.');
  }
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
  await updateTodo({
    apiBaseUrl,
    userId,
    id: todoId,
    done: done === 'true',
  });
  return redirect('/');
}
