import { z } from 'zod';
import { authLoginSchema } from './LoginSchema';

// schema; reusing login schema because they are identical
export const authSignupSchema = authLoginSchema;

//
// interface
//
type AuthSignupSchema = z.infer<typeof authSignupSchema>;
export default AuthSignupSchema;
