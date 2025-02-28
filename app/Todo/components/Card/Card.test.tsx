import { createRemixStub } from '@remix-run/testing';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import TodoCard from './Card';
import TodoItem, { initTodo } from '~/Todo/types/Item';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { faker } from '@faker-js/faker';

// utility
class ExecutionDetainer {
  private frame = 100; // miliseconds
  private maxDetentionTime = 5000; // miliseconds
  private isDetaining = false;

  private static delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async detainUntilResuming() {
    this.isDetaining = true;
    for (let i = 0; i < this.maxDetentionTime; i += this.frame) {
      await ExecutionDetainer.delay(this.frame);
      if (!this.isDetaining) {
        break;
      }
    }
  }

  async resumeDetained() {
    this.isDetaining = false;
    await ExecutionDetainer.delay(this.frame);
  }
}

// local utility
function renderTodoCard(mockTodo: TodoItem, actions: any[] = []) {
  const RemixStub = createRemixStub([
    {
      path: '/',
      loader: () => json({ todo: mockTodo }),
      Component: function () {
        const { todo } = useLoaderData<typeof this.loader>();
        return <TodoCard todo={todo} />;
      },
    },
    ...actions,
  ]);
  render(<RemixStub />);
}

//
// high level integration test
//
describe('TodoCard', () => {
  test('data displaying', async () => {
    const mockTodo = initTodo({});
    renderTodoCard(mockTodo);
    const card = await screen.findByRole('listitem', { name: mockTodo.label });
    expect(card.getAttribute('id')).toBe(mockTodo.id);
    const checkbox = within(card).getByRole<HTMLInputElement>('checkbox', {
      name: 'Done',
    });
    expect(checkbox.checked).toBe(mockTodo.done);
    within(card).getByText(mockTodo.label);
  });

  test('edit mode data displaying', async () => {
    const user = userEvent.setup();
    const mockTodo = initTodo({});
    renderTodoCard(mockTodo);
    const card = await screen.findByRole('listitem', { name: mockTodo.label });
    const editButton = within(card).getByRole('button', { name: 'Edit' });
    await user.click(editButton);
    const cardEditMode = screen.getByRole('listitem', { name: mockTodo.label });
    expect(cardEditMode.getAttribute('id')).toBe(mockTodo.id);
    const checkbox = within(cardEditMode).getByRole<HTMLInputElement>(
      'checkbox',
      {
        name: 'Done',
      },
    );
    expect(checkbox.checked).toBe(mockTodo.done);
  });

  test('checkbox toggling', async () => {
    const user = userEvent.setup();
    const mockTodo = initTodo({
      id: faker.string.uuid(),
    });
    const detainer = new ExecutionDetainer();
    renderTodoCard(mockTodo, [
      {
        path: '/update/:id',
        action: async function () {
          await detainer.detainUntilResuming();
          return json({});
        },
      },
    ]);
    const card = await screen.findByRole('listitem', { name: mockTodo.label });
    const checkbox = within(card).getByRole<HTMLInputElement>('checkbox', {
      name: 'Done',
    });
    await user.click(checkbox);
    expect(card.ariaDisabled).toBe('true');
    await detainer.resumeDetained(); // the action completes its execution
    expect(card.ariaDisabled).toBe('false');
  });

  test('editing', async () => {
    const user = userEvent.setup();
    const mockTodo = initTodo({
      id: faker.string.uuid(),
    });
    const detainer = new ExecutionDetainer();
    renderTodoCard(mockTodo, [
      {
        path: '/update/:id',
        action: async function () {
          await detainer.detainUntilResuming();
          return json({});
        },
      },
    ]);
    const card = await screen.findByRole('listitem', { name: mockTodo.label });
    const editButton = within(card).getByRole('button', { name: 'Edit' });
    await user.click(editButton);
    const cardEditMode = screen.getByRole('listitem', { name: mockTodo.label });
    const editForm = within(cardEditMode).getByRole('form', {
      name: 'Edit Todo',
    });
    const input = within(editForm).getByPlaceholderText('Something to do...');
    const editedTodoLabel = faker.lorem.sentence();
    await user.clear(input);
    await user.type(input, editedTodoLabel);
    fireEvent.submit(editForm);
    const cardUpdated = await screen.findByRole('listitem', {
      name: editedTodoLabel,
    });
    expect(cardUpdated.ariaDisabled).toBe('true');
    await detainer.resumeDetained(); // the action completes its execution
    expect(cardUpdated.ariaDisabled).toBe('false');
  });

  test('deletion', async () => {
    const user = userEvent.setup();
    const mockTodo = initTodo({
      id: faker.string.uuid(),
    });
    const detainer = new ExecutionDetainer();
    renderTodoCard(mockTodo, [
      {
        path: '/delete/:id',
        action: async function () {
          await detainer.detainUntilResuming();
          return json({});
        },
      },
    ]);
    const card = await screen.findByRole('listitem', { name: mockTodo.label });
    const deleteButton = within(card).getByRole('button', { name: 'Delete' });
    await user.click(deleteButton);
    const dialog = screen.getByRole('dialog', { name: 'Delete this Todo?' });
    const confirmButton = within(dialog).getByRole('button', { name: 'Yes' });
    await user.click(confirmButton);
    expect(card.ariaDisabled).toBe('true');
    await detainer.resumeDetained(); // the action completes its execution
  });
});
