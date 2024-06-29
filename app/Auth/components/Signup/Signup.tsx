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
import { Link, useFetcher } from '@remix-run/react';
import { useForm } from 'react-hook-form';
import AuthSignupSchema, { authSignupSchema } from '~/Auth/types/SignupSchema';

// props
interface Props {
  takenUsername?: string;
}

/**
 * Signup component.
 *
 * Implemented as a simple `<form>` with `useFetcher()` for submitting and
 * `react-hook-form` for client side validation. The `react-hook-form` logic
 * is straightforward but switching to `useFetcher()` has been necessary
 * and the route logic has become a bit more complex.
 */
export default function AuthSignup({ takenUsername }: Props) {
  const headingHtmlId = 'RouteSignup_h1';
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSignupSchema>({
    resolver: zodResolver(authSignupSchema),
  });
  const loading = fetcher.state === 'submitting' || fetcher.state === 'loading';

  function handleSubmitSuccess(data: AuthSignupSchema) {
    if (loading) {
      return;
    }
    fetcher.submit(data, { method: 'POST' });
  }

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
      <form
        method="post"
        noValidate
        aria-labelledby={headingHtmlId}
        onSubmit={handleSubmit(handleSubmitSuccess)}
      >
        <Box mb={0.5}>
          <TextField
            {...register('username')}
            label="Username"
            size="small"
            required
            error={!!errors.username}
            helperText={errors.username?.message}
            // helperText="Lowercase Latin letters and numbers, starting from a letter."
            disabled={loading}
          />
        </Box>
        <Box mb={0.5}>
          <TextField
            {...register('password')}
            type="password"
            label="Password"
            size="small"
            required
            error={!!errors.password}
            helperText={errors.password?.message}
            // helperText="Minimum 8 characters, a lowercase, an uppercase and a special character."
            disabled={loading}
          />
        </Box>
        <Box>
          <Button type="submit" variant="contained" disabled={loading}>
            Sign Up
          </Button>
        </Box>
      </form>
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
