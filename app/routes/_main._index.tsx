import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData, useRouteError } from '@remix-run/react';
import CommonErrorScreen from '~/Common/components/ErrorScreen';
import TodoMain from '~/Todo/components/Main';
import TodoItem, { todoItemSchema } from '~/Todo/types/Item';
import env, { mode } from '~/env';
import sessions from '~/sessions';

// utility
async function fetchTodos(
  userId: string,
  apiBaseUrl: string,
): Promise<TodoItem[]> {
  const url = new URL('todo', apiBaseUrl);
  const res = await fetch(url, {
    headers: {
      authorization: `Bearer ${userId}`,
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
  const { getSession, sessionCookieName } = sessions();
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get(sessionCookieName);
  const todos = await fetchTodos(userId, apiBaseUrl);
  return json({ todos });
}

// meta
export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Todo' },
    { name: 'description', content: 'Remix Todo app.' },
  ];
};

// error boundary
export function ErrorBoundary() {
  const error = useRouteError();
  const { isDev } = mode();
  return <CommonErrorScreen error={error} isDev={isDev} />;
}

/**
 * Index (root) route component.
 */
export default function RouteIndex() {
  const { todos } = useLoaderData<typeof loader>();
  return <TodoMain todos={todos} />;
}
