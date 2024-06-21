import { z } from 'zod';

// schema
export const authMeSchema = z.object({
  username: z.string(),
});

//
// interface
//
type AuthMe = z.infer<typeof authMeSchema>;
export default AuthMe;
