import {
  AppBar,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link } from '@remix-run/react';

interface Props {
  username?: string | null;
}

export default function CommonHeader({ username }: Props) {
  return (
    <AppBar position="static">
      <Toolbar component={Container}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          flex={1}
          gap={1}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
            component={Link}
            to="/"
          >
            Remix Todo
          </Typography>
          {username && (
            <Button
              color="inherit"
              component={Link}
              to="/logout"
              sx={{ whiteSpace: 'nowrap' }}
            >
              Logout ({username})
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
