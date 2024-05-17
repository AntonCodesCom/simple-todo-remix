import { ArrowDropDown } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from '@remix-run/react';
import { useState } from 'react';

interface Props {
  error: unknown;
  isDev?: boolean;
}

export default function CommonErrorScreen({ error, isDev = false }: Props) {
  const [errorStackOpen, setErrorStackOpen] = useState(false);
  // TODO: route error
  return (
    <Container>
      <Typography variant="h3" sx={{ color: 'error.main' }} mb={2}>
        Error
      </Typography>
      {isDev && error instanceof Error && (
        <Box mb={2}>
          <Alert severity="error">
            <Typography mb={1}>
              <b>{error.name}</b>: {error.message}
            </Typography>
            {error.stack && (
              <>
                <Stack
                  component={ButtonBase}
                  disableRipple
                  direction="row"
                  alignItems="center"
                  onClick={() => setErrorStackOpen((x) => !x)}
                  mb={1}
                >
                  <Typography sx={{ textDecoration: 'underline' }}>
                    Toggle error stack
                  </Typography>
                  <ArrowDropDown />
                </Stack>
                <Typography>
                  {errorStackOpen ? error.stack : '[...]'}
                </Typography>
              </>
            )}
          </Alert>
        </Box>
      )}
      <Typography>We're sorry, an unexpected error occurred.</Typography>
      <Typography mb={2}>Please reload the page to retry.</Typography>
      <Stack direction="row" gap={0.5}>
        <Button variant="contained" component={Link} to="" reloadDocument>
          Reload page
        </Button>
      </Stack>
    </Container>
  );
}
