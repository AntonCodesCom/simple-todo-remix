import {
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import { UnauthorizedException } from '~/Auth/exceptions';
import AuthLoggedInSchema, {
  authLoggedInSchema,
} from '~/Auth/types/LoggedInSchema';
import { authLoginSchema } from '~/Auth/types/LoginSchema';
import config from '~/config';
import sessions from '~/sessions';

// utility
async function fetchLogin(
  username: string,
  password: string,
  apiBaseUrl: string,
): Promise<AuthLoggedInSchema> {
  const body = JSON.stringify({ username, password });
  const url = new URL('auth/login', apiBaseUrl);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedException();
    }
    throw new Error('HTTP error occurred while fetching `POST /auth/login`.');
  }
  const data = await res.json();
  return authLoggedInSchema.parse(data);
}

// action
export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const data = authLoginSchema.parse({
    username: form.get('username'),
    password: form.get('password'),
  });
  const { username, password } = data;
  const { apiBaseUrl } = config();
  try {
    const { accessToken } = await fetchLogin(username, password, apiBaseUrl);
    const { getSession, commitSession, sessionCookieName } = sessions();
    const session = await getSession(request.headers.get('Cookie'));
    session.set(sessionCookieName, accessToken);
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      return json({ incorrectCredentials: true });
    }
    throw err;
  }
}

export default function RouteAuthLogin() {
  const actionData = useActionData<typeof action>();
  const headingHtmlId = 'AuthLogin_h1';
  return (
    <Container>
      <Typography id={headingHtmlId} variant="h4" component="h1" mb={1}>
        Login
      </Typography>
      {actionData?.incorrectCredentials && (
        <Alert severity="error">Incorrect username or password.</Alert>
      )}
      <Box pb={1} />
      <Form method="post" reloadDocument aria-labelledby={headingHtmlId}>
        <Box mb={0.5}>
          <TextField name="username" label="Username" size="small" required />
        </Box>
        <Box mb={0.5}>
          <TextField
            name="password"
            type="password"
            label="Password"
            size="small"
            required
          />
        </Box>
        <Box>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Box>
      </Form>
      <Box mb={2} />
      <Box>
        <Typography>
          Don't have an account?{' '}
          <MuiLink component={Link} to="../signup">
            Sign up
          </MuiLink>{' '}
          now!
        </Typography>
      </Box>
    </Container>
  );
}
