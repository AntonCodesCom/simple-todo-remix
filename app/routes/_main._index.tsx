import type { MetaFunction } from '@remix-run/node';
import TodoMain from '~/Todo/components/Main';

// meta
export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Todo' },
    { name: 'description', content: 'Remix Todo app.' },
  ];
};

const todos = [
  {
    label: 'Lorem ipsum dolor sit amet.',
  },
  {
    label: 'Todo 2',
  },
  {
    label: 'Todo 3',
  },
];

/**
 * Index (root) route component.
 */
export default function RouteIndex() {
  return <TodoMain todos={todos} />;
}
