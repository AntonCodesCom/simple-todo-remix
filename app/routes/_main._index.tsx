import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import TodoMain from '~/Todo/components/Main';
import TodoItem, { todoItemSchema } from '~/Todo/types/Item';
import config from '~/config';
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
    // TODO: handle 401
  }
  const data = await res.json();
  return todoItemSchema.array().parse(data);
}

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { apiBaseUrl } = config();
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

/**
 * Index (root) route component.
 */
export default function RouteIndex() {
  const { todos } = useLoaderData<typeof loader>();
  return <TodoMain todos={todos} />;
}
