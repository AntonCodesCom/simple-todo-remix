import { z } from 'zod';

// schema
export const authSignupSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(4, 'At least 4 characters')
    .max(64, 'Up to 64 characters long')
    .regex(
      /^[a-z]+[a-z0-9_]*$/,
      'Lowercase Latin letters, digits and underscores, starting from a letter',
    ),
  password: z
    .string()
    .min(1, 'Password is required')
    .regex(/.{8,}/, 'At least 8 characters')
    .max(256, 'Up to 256 characters long')
    .regex(/[A-Z]+/, 'At least 1 uppercase character')
    .regex(/[a-z]+/, 'At least 1 lowercase character')
    .regex(/[0-9]+/, 'At least 1 digit')
    .regex(
      /[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/\\ ]/,
      'At least 1 special character',
    ),
});

//
// interface
//
type AuthSignupSchema = z.infer<typeof authSignupSchema>;
export default AuthSignupSchema;
