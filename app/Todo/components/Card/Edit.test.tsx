import { render, screen } from '@testing-library/react';
import todoItemsFixture from '~/Todo/fixtures/items';
// import todoItemsFixture from '../../fixtures/items';
import TodoCardEdit from './Edit';
import { expect, test } from 'vitest';

//
// integration test
//
test('TodoCardEdit', () => {
  const mockTodos = todoItemsFixture;
  render(<TodoCardEdit todo={mockTodos[0]} />);
  expect(true).toBe(true);
});
