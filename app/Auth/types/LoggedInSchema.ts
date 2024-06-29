import { z } from 'zod';

export const authLoggedInSchema = z.object({
  accessToken: z.string(),
  username: z.string(),
});

/**
 * Must be complied by the backend API.
 */
type AuthLoggedInSchema = z.infer<typeof authLoggedInSchema>;
export default AuthLoggedInSchema;
