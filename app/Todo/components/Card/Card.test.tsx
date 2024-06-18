import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  const user = userEvent.setup();
  const mockTodo = initTodo({});
  render(<TodoCard todo={mockTodo} />);
  const card = screen.getByRole('listitem', { name: mockTodo.label });
  expect(card.getAttribute('id')).toBe(mockTodo.id);
  const checkbox = within(card).getByRole<HTMLInputElement>('checkbox', {
    name: 'Done',
  });
  expect(checkbox.checked).toBe(mockTodo.done);
  const editButton = within(card).getByRole('button', { name: 'Edit' });
  await user.click(editButton);
  screen.getByRole('form', { name: 'Edit Todo' });
  const card2 = screen.getByRole('listitem', { name: mockTodo.label });
  expect(card2.getAttribute('id')).toBe(mockTodo.id);
  // TODO: "Done" checkbox value
});
