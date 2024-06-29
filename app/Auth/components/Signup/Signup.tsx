import {
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Link } from '@remix-run/react';
import { authSignupSchema } from '~/Auth/types/SignupSchema';

interface Props {
  takenUsername?: string;
}

/**
 * Signup component.
 */
export default function AuthSignup({ takenUsername }: Props) {
  const headingHtmlId = 'RouteSignup_h1';
  return (
    <Container>
      <Typography id={headingHtmlId} variant="h4" component="h1" mb={1}>
        Sign Up
      </Typography>
      {takenUsername && (
        <Alert severity="error">
          Username "{takenUsername}" is already taken.
        </Alert>
      )}
      <Box pb={1} />
      <Form method="post" aria-labelledby={headingHtmlId}>
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
