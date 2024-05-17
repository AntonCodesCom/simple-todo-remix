import { z } from 'zod';

export const todoItemSchema = z.object({
  label: z.string(),
  done: z.boolean(),
});

type TodoItem = z.infer<typeof todoItemSchema>;

export default TodoItem;
