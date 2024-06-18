import { render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import TodoCard from './Card';
import { initTodo } from '~/Todo/types/Item';
import fetcherMock from '~/Testing/utils/fetcherMock';

// mocking breaking dependency
vi.mock('@remix-run/react', () => ({
  useFetcher: () => fetcherMock,
}));

//
// integration test
//
test('TodoCard', async () => {
  const mockTodo = initTodo({});
  render(<TodoCard todo={mockTodo} />);
  const card = screen.getByRole('listitem', { name: mockTodo.label });
  expect(card.getAttribute('id')).toBe(mockTodo.id);
  const checkbox = within(card).getByRole<HTMLInputElement>('checkbox', {
    name: 'Done',
  });
  expect(checkbox.checked).toBe(mockTodo.done);
  // within(card).getByRole('button', { name: 'Edit' }).click()
});
