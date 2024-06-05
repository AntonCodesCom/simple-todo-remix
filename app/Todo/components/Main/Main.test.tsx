import { createRemixStub } from '@remix-run/testing';
import { render, screen } from '@testing-library/react';
import todoItemsFixture from '../../fixtures/items';
import TodoMain from './Main';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import TodoItem from '~/Todo/types/Item';
import { test, vi } from 'vitest';

vi.mock('@remix-run/react', () => ({
  useFetcher: () => ({
    state: 'idle',
    submit: () => {},
    Form: () => null,
  }),
}));

const mockTodos = todoItemsFixture;

// const RemixStub = createRemixStub([
//   {
//     path: "/",
//     Component () {
//       const { todos } = useLoaderData() as { todos: TodoItem[] };
//       return <TodoMain todos={todos} />
//     },
//     loader() {
//       return json({ todos: mockTodos });
//     },
//   }
// ])

//
// integration test
//
test('TodoMain', () => {
  render(<TodoMain todos={mockTodos} />);
  // render(<RemixStub />)
});
