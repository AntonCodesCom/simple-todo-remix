import { faker } from '@faker-js/faker';
import { z } from 'zod';

export const todoItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  done: z.boolean(),
  createdAt: z.string().datetime(),
});

type TodoItem = z.infer<typeof todoItemSchema>;

export default TodoItem;

function initTodo(partial: Partial<TodoItem>): TodoItem {
  return {
    id: faker.string.sample(),
    label: faker.lorem.sentence(),
    done: faker.datatype.boolean(),
    createdAt: partial.createdAt ?? new Date().toString(),
  };
}

export function initTodos(partials: Partial<TodoItem>[]): TodoItem[] {
  return partials.map(initTodo);
}
