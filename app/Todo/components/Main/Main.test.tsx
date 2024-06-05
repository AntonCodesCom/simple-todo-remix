import { createRemixStub } from '@remix-run/testing';
import { render, screen, within } from '@testing-library/react';
import todoItemsFixture from '../../fixtures/items';
import TodoMain from './Main';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import TodoItem from '~/Todo/types/Item';
import { expect, test, vi } from 'vitest';
import arrayIdHash from '~/Common/utils/arrayIdHash';
import { faker } from '@faker-js/faker';

// breaking dependency: mocking
vi.mock('@remix-run/react', () => ({
  useFetcher: () => ({
    state: 'idle',
    submit: () => {},
    Form: () => null,
  }),
}));

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
test('TodoMain', async () => {
  const mockTodos = faker.helpers.arrayElements(todoItemsFixture);
  render(<TodoMain todos={mockTodos} />);
  const list = screen.getByRole('list', { name: 'My Todos' });
  expect(list.getAttribute('data-idhash')).toBe(arrayIdHash(mockTodos));
  const cards = within(list).getAllByRole('listitem');
  const actualIds = cards.map((x) => x.getAttribute('id'));
  const expectedIds = mockTodos.map((x) => x.id);
  expect(actualIds.sort()).toStrictEqual(expectedIds.sort());
  // render(<RemixStub />)
});
