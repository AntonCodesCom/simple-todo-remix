import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import CommonErrorBoundary from '~/Common/components/ErrorBoundary';
import TodoMain from '~/Todo/components/Main';
import TodoItem, { todoItemSchema } from '~/Todo/types/Item';
import env, { mode } from '~/env';
import { authSession } from '~/sessions';

// utility
async function fetchTodos(
  accessToken: string,
  apiBaseUrl: string,
): Promise<TodoItem[]> {
  const url = new URL('todo', apiBaseUrl);
  const res = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Unexpected error occurred while fetching todos.');
  }
  const data = await res.json();
  return todoItemSchema
    .array()
    .parse(data)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// utility
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { isDev } = mode();
  isDev && (await delay(1)); // simulating latency
  const { apiBaseUrl } = env();
  const { getAuthSession, authSessionName } = authSession();
  const session = await getAuthSession(request.headers.get('Cookie'));
  const accessToken = session.get(authSessionName);
  const todos = await fetchTodos(accessToken, apiBaseUrl);
  return json({ todos });
}

// error boundary
export const ErrorBoundary = CommonErrorBoundary;

/**
 * Index (root) route component.
 */
export default function RouteIndex() {
  const { todos } = useLoaderData<typeof loader>();
  return <TodoMain todos={todos} />;
}
