import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import config from '~/config';
import sessions from '~/sessions';

export default function RouteMainLogin() {
  return (
    <Container>
      <Typography variant="h4" component="h1" mb={2}>
        Login
      </Typography>
      <Form method="post" reloadDocument>
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
    </Container>
  );
}
