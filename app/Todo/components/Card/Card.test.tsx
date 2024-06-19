import { createRemixStub } from '@remix-run/testing';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import TodoCard from './Card';
import { initTodo } from '~/Todo/types/Item';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

//
// high-level integration test
//
test('TodoCard', async () => {
  const mockTodo = initTodo({});
  const RemixStub = createRemixStub([
    {
      path: '/',
      loader: () => json({ todo: mockTodo }),
      Component: function () {
        const { todo } = useLoaderData<typeof this.loader>();
        return <TodoCard todo={todo} />;
      },
    },
  ]);
  const user = userEvent.setup();
  render(<RemixStub />);
  const card = await screen.findByRole('listitem', { name: mockTodo.label });
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
