import { z } from 'zod';

export const todoItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  done: z.boolean(),
  createdAt: z.string().datetime(),
});

type TodoItem = z.infer<typeof todoItemSchema>;

export default TodoItem;
