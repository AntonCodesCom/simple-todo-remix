import { z } from 'zod';

// schema
export const authSignupSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(4, 'At least 4 characters')
    .regex(
      /^[a-z]+[a-z0-9]*$/,
      'Lowercase Latin letters and digits, starting from a letter',
    ),
  password: z.string().min(1, 'Password is required'),
  // TODO: password validation rules
});

//
// interface
//
type AuthSignupSchema = z.infer<typeof authSignupSchema>;
export default AuthSignupSchema;
