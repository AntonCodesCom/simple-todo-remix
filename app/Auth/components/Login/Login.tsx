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
import { FormEvent, useEffect, useState } from 'react';

interface Props {
  incorrectCredentials?: boolean;
  lastSubmittedAt?: number;
}

export default function AuthLogin({
  incorrectCredentials,
  lastSubmittedAt,
}: Props) {
  const headingHtmlId = 'AuthLogin_h1';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [lastSubmittedAt]);

  function handleSubmit(e: FormEvent) {
    if (loading) {
      e.preventDefault();
      return;
    }
    setLoading(true);
  }

  return (
    <Container>
      <Typography id={headingHtmlId} variant="h4" component="h1" mb={1}>
        Login
      </Typography>
      {incorrectCredentials && !loading && (
        <Alert severity="error">Incorrect username or password.</Alert>
      )}
      <Box pb={1} />
      <Form
        method="post"
        aria-labelledby={headingHtmlId}
        onSubmit={handleSubmit}
      >
        <Box mb={0.5}>
          <TextField
            name="username"
            label="Username"
            size="small"
            required
            disabled={loading}
          />
        </Box>
        <Box mb={0.5}>
          <TextField
            name="password"
            type="password"
            label="Password"
            size="small"
            required
            disabled={loading}
          />
        </Box>
        <Box>
          <Button type="submit" variant="contained" disabled={loading}>
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
