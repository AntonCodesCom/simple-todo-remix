import { render, screen } from '@testing-library/react';
import todoItemsFixture from '~/Todo/fixtures/items';
import TodoCardEdit from './Edit';

//
// integration test
//
test('TodoMain', () => {
  const mockTodos = todoItemsFixture;
  render(<TodoCardEdit todo={mockTodos[0]} />);
});
