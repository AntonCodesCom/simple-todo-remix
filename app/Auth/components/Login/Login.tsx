import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Link, useSubmit } from '@remix-run/react';
import { FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthLoginSchema, { authLoginSchema } from '~/Auth/types/LoginSchema';

// props
interface Props {
  incorrectCredentials?: boolean;
  lastSubmittedAt?: number;
}

/**
 * Login component.
 *
 * The form implemented as a `Form`. Client side validation is implemented
 * with `react-hook-form`. Workarounds were needed for both `Form` and
 * `react-hook-form` implementation, but this allowed us to stick with `Form`
 * thus simplifying the route logic.
 */
export default function AuthLogin({
  incorrectCredentials,
  lastSubmittedAt,
}: Props) {
  const headingHtmlId = 'AuthLogin_h1';
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const {
    register,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<AuthLoginSchema>({
    resolver: zodResolver(authLoginSchema),
    mode: 'onChange',
  });
  const submit = useSubmit();

  useEffect(() => {
    setLoading(false);
  }, [lastSubmittedAt]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDirty(true);
    if (loading) {
      return;
    }
    if (!(await trigger())) {
      return;
    }
    setLoading(true);
    submit(getValues(), { method: 'POST' });
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
        noValidate
      >
        <Box mb={0.5}>
          <TextField
            {...register('username')}
            label="Username"
            size="small"
            required
            disabled={loading}
            error={dirty && !!errors.username}
            helperText={dirty && errors.username?.message}
          />
        </Box>
        <Box mb={0.5}>
          <TextField
            {...register('password')}
            type="password"
            label="Password"
            size="small"
            required
            disabled={loading}
            error={dirty && !!errors.password}
            helperText={dirty && errors.password?.message}
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
