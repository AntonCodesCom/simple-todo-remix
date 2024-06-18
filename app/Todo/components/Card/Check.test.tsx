import { render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import TodoCardCheck from './Check';
import { initTodo } from '~/Todo/types/Item';
import userEvent from '@testing-library/user-event';

//
// integration test
//
describe('TodoCardCheck', () => {
  describe('happy path', () => {
    test('"Edit" button click', async () => {
      const user = userEvent.setup();
      const mockTodo = initTodo({});
      const mockOnEditClick = vi.fn();
      render(<TodoCardCheck todo={mockTodo} onEditClick={mockOnEditClick} />);
      const card = screen.getByRole('listitem', { name: mockTodo.label });
      const editButton = within(card).getByRole('button', { name: 'Edit' });
      await user.click(editButton);
      expect(mockOnEditClick).toHaveBeenCalled();
    });

    test('"Done" checkbox toggle', async () => {
      const user = userEvent.setup();
      const mockTodo = initTodo({});
      const mockOnCheckToggle = vi.fn();
      render(
        <TodoCardCheck todo={mockTodo} onCheckToggle={mockOnCheckToggle} />,
      );
      const card = screen.getByRole('listitem', { name: mockTodo.label });
      const checkbox = within(card).getByRole<HTMLInputElement>('checkbox', {
        name: 'Done',
      });
      const initialChecked = checkbox.checked;
      const expectedChecked = !initialChecked;
      await user.click(checkbox);
      expect(mockOnCheckToggle).toHaveBeenCalledWith(expectedChecked);
      expect(checkbox.checked).toBe(expectedChecked);
    });

    test('"Delete" element displaying', () => {
      const testId = '"Delete" element';
      render(
        <TodoCardCheck
          todo={initTodo({})}
          deleteElement={<div data-testid={testId} />}
        />,
      );
      screen.getByTestId(testId);
    });
  });

  describe('disabled', () => {
    test('"Edit" button click', async () => {
      const user = userEvent.setup();
      const mockTodo = initTodo({});
      const mockOnEditClick = vi.fn();
      render(
        <TodoCardCheck
          disabled
          todo={mockTodo}
          onEditClick={mockOnEditClick}
        />,
      );
      const card = screen.getByRole('listitem', { name: mockTodo.label });
      const editButton = within(card).getByRole('button', { name: 'Edit' });
      await user.click(editButton);
      expect(mockOnEditClick).not.toHaveBeenCalled();
    });

    test('"Done" checkbox toggle', async () => {
      const user = userEvent.setup();
      const mockTodo = initTodo({});
      const mockOnCheckToggle = vi.fn();
      render(
        <TodoCardCheck
          disabled
          todo={mockTodo}
          onCheckToggle={mockOnCheckToggle}
        />,
      );
      const card = screen.getByRole('listitem', { name: mockTodo.label });
      const checkbox = within(card).getByRole<HTMLInputElement>('checkbox', {
        name: 'Done',
      });
      const initialChecked = checkbox.checked;
      await user.click(checkbox);
      expect(mockOnCheckToggle).not.toHaveBeenCalled();
      expect(checkbox.checked).toBe(initialChecked);
    });

    test.todo('"Delete" element displaying');
  });
});
