import { faker } from '@faker-js/faker';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import arrayIdHash from '~/Common/utils/arrayIdHash';
import TodoMain from './Main';
import fetcherMock from '~/Testing/utils/fetcherMock';
import { initTodo } from '~/Todo/types/Item';

// breaking dependency: mocking
vi.mock('@remix-run/react', () => ({
  useFetcher: () => fetcherMock,
}));

//
// integration test
//
describe('TodoMain', () => {
  test('happy path', async () => {
    const mockTodos = faker.helpers.multiple(() => initTodo({}), {
      count: { min: 1, max: 5 },
    });
    render(<TodoMain todos={mockTodos} />);
    const list = screen.getByRole('list', { name: 'My Todos' });
    expect(list.getAttribute('data-idhash')).toBe(arrayIdHash(mockTodos));
    const cards = within(list).getAllByRole('listitem');
    const actualIds = cards.map((x) => x.getAttribute('id'));
    const expectedIds = mockTodos.map((x) => x.id);
    expect(actualIds.sort()).toStrictEqual(expectedIds.sort());
  });

  test('empty state', () => {
    render(<TodoMain todos={[]} />);
    screen.getByText('No todos yet. Add one!');
  });
});
