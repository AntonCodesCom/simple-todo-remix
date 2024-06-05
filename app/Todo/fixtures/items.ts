import TodoItem, { initTodos } from '../types/Item';

/**
 * Todo items fixture.
 *
 * The fixture must contain at least 1 element in order for
 * integration tests to function properly.
 */
const todoItemsFixture: TodoItem[] = initTodos([
  {
    id: 'todo-1',
  },
  {
    id: 'todo-2',
  },
  {
    id: 'todo-3',
  },
  {
    id: 'todo-4',
  },
  {
    id: 'todo-5',
  },
]);

export default todoItemsFixture;
