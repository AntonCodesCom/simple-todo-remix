import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { UnauthorizedException } from '~/Auth/exceptions';
import AuthLoggedInSchema, {
  authLoggedInSchema,
} from '~/Auth/types/LoggedInSchema';
import config from '~/config';
import sessions from '~/sessions';

export default function RouteSignup() {
  const headingHtmlId = 'RouteSignup_h1';
  return (
    <Container>
      <Typography id={headingHtmlId} variant="h4" component="h1" mb={2}>
        Sign Up
      </Typography>
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
            Sign Up
          </Button>
        </Box>
      </Form>
    </Container>
  );
}
