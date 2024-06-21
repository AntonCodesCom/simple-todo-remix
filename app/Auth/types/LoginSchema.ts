import { z } from 'zod';

export const authLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type AuthLoginSchema = z.infer<typeof authLoginSchema>;

export default AuthLoginSchema;
