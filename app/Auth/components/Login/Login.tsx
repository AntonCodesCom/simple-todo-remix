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

interface Props {
  incorrectCredentials?: boolean;
}

export default function AuthLogin({ incorrectCredentials }: Props) {
  const headingHtmlId = 'AuthLogin_h1';
  return (
    <Container>
      <Typography id={headingHtmlId} variant="h4" component="h1" mb={1}>
        Login
      </Typography>
      {incorrectCredentials && (
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
