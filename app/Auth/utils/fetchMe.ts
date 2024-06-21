import { UnauthorizedException } from '../exceptions';
import AuthMe, { authMeSchema } from '../types/Me';

export default async function fetchMe(
  accessToken: string,
  apiBaseUrl: string,
): Promise<AuthMe> {
  const url = new URL('auth/me', apiBaseUrl);
  const res = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedException();
    } else {
      throw new Error(
        'Unexpected error occurred while fetching `GET /auth/me`.',
      );
    }
  }
  const data = await res.json();
  return authMeSchema.parse(data);
}
