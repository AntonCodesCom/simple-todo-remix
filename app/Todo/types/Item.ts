import { faker } from '@faker-js/faker';
import { z } from 'zod';

// schema
export const todoItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  done: z.boolean(),
  createdAt: z.string().datetime(),
});

//
// entity interface
//
type TodoItem = z.infer<typeof todoItemSchema>;
export default TodoItem;

// initializer
export function initTodo(partial: Partial<TodoItem>): TodoItem {
  return {
    id: partial.id ?? faker.string.sample(),
    label: partial.label ?? faker.lorem.sentence(),
    done: partial.done ?? faker.datatype.boolean(),
    createdAt: partial.createdAt ?? new Date().toISOString(),
  };
}

// batch initializer
export function initTodos(partials: Partial<TodoItem>[]): TodoItem[] {
  return partials.map(initTodo);
}
