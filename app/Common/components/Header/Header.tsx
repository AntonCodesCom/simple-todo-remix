import {
  AppBar,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from '@remix-run/react';

interface Props {
  username?: string | null;
}

export default function CommonHeader({ username }: Props) {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
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
              Logout&nbsp;
              {sm && (
                <Typography
                  variant="button"
                  sx={{
                    maxWidth: { sm: '18rem', md: '30rem' },
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  ({username}
                </Typography>
              )}
              {sm && ')'}
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
