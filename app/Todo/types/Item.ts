import { z } from 'zod';

export const todoItemSchema = z.object({
  label: z.string(),
  done: z.boolean(),
  createdAt: z.string().datetime(),
});

type TodoItem = z.infer<typeof todoItemSchema>;

export default TodoItem;
