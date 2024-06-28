import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { ConflictException, UnauthorizedException } from '~/Auth/exceptions';
import AuthLoggedInSchema, {
  authLoggedInSchema,
} from '~/Auth/types/LoggedInSchema';
import { authSignupSchema } from '~/Auth/types/SignupSchema';
import env from '~/env';
import { authSession, meSession } from '~/sessions';

// utility
async function fetchSignup(
  username: string,
  password: string,
  apiBaseUrl: string,
): Promise<AuthLoggedInSchema> {
  const body = JSON.stringify({ username, password });
  const url = new URL('auth/signup', apiBaseUrl);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  if (!res.ok) {
    if (res.status === 409) {
      throw new ConflictException();
    }
    throw new Error('HTTP error occurred while fetching `POST /auth/login`.');
  }
  const data = await res.json();
  return authLoggedInSchema.parse(data);
}

// action
export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const data = authSignupSchema.parse({
    username: form.get('username'),
    password: form.get('password'),
  });
  const { username, password } = data;
  const { apiBaseUrl } = env();
  try {
    const { accessToken, username: fetchedUsername } = await fetchSignup(
      username,
      password,
      apiBaseUrl,
    );
    const { getAuthSession, commitAuthSession, authSessionName } =
      authSession();
    const cookieHeader = request.headers.get('Cookie');
    const session = await getAuthSession(cookieHeader);
    session.set(authSessionName, accessToken);
    const { getMeSession, commitMeSession } = meSession();
    const _meSession = await getMeSession(cookieHeader);
    _meSession.set('me', { username: fetchedUsername });
    const headers = new Headers();
    headers.append('Set-Cookie', await commitAuthSession(session));
    headers.append('Set-Cookie', await commitMeSession(_meSession));
    return redirect('/', {
      headers,
    });
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      // TODO: error flash message
      return redirect('.');
    }
    throw err;
  }
}

/**
 * Signup route component.
 */
export default function RouteSignup() {
  const headingHtmlId = 'RouteSignup_h1';
  return (
    <Container>
      <Typography id={headingHtmlId} variant="h4" component="h1" mb={2}>
        Sign Up
      </Typography>
      <Form method="post" reloadDocument aria-labelledby={headingHtmlId}>
        <Box mb={0.5}>
          <TextField
            name="username"
            label="Username"
            size="small"
            required
            helperText="Lowercase Latin letters and numbers, starting from a letter."
          />
        </Box>
        <Box mb={0.5}>
          <TextField
            name="password"
            type="password"
            label="Password"
            size="small"
            required
            helperText="Minimum 8 characters, a lowercase, an uppercase and a special character."
          />
        </Box>
        <Box>
          <Button type="submit" variant="contained">
            Sign Up
          </Button>
        </Box>
      </Form>
      <Box mb={2} />
      <Box>
        <Typography>
          Already have an account?{' '}
          <MuiLink component={Link} to="../login">
            Log in
          </MuiLink>
          !
        </Typography>
      </Box>
    </Container>
  );
}
