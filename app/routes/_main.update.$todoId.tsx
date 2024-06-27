import { ActionFunctionArgs, redirect } from '@remix-run/node';
import env, { mode } from '~/env';
import { authSession } from '~/sessions';

// utility
interface Params {
  id: string;
  accessToken: string;
  apiBaseUrl: string;
  label?: string;
  done?: boolean;
}
async function updateTodo({
  id,
  accessToken,
  label,
  done,
  apiBaseUrl,
}: Params): Promise<void> {
  const url = new URL(`todo/${id}`, apiBaseUrl);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
  const { isDev } = mode();
  isDev && (await delay(1)); // simulating latency
  const { todoId } = params;
  if (!todoId) {
    throw new Error('`todoId` parameter missing.');
  }
  const { apiBaseUrl } = env();
  const { getAuthSession, authSessionName } = authSession();
  const session = await getAuthSession(request.headers.get('Cookie'));
  const accessToken = session.get(authSessionName);
  const formData = await request.formData();
  const label = formData.get('label') ?? undefined;
  if (label && typeof label !== 'string') {
    throw new Error('`label` must be a non-empty string.');
  }
  const done = formData.get('done');
  if (done && done !== 'true' && done !== 'false') {
    throw new Error('`done` must be either "true" or "false".');
  }
  await updateTodo({
    apiBaseUrl,
    accessToken,
    id: todoId,
    label,
    done: done ? done === 'true' : undefined,
  });
  return redirect('/');
}
