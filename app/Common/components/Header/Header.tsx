import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link } from '@remix-run/react';

interface Props {
  username?: string | null;
}

export default function CommonHeader({ username }: Props) {
  return (
    <AppBar position="static">
      <Toolbar component={Container}>
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            color: 'white',
            textDecoration: 'none',
          }}
          component={Link}
          to="/"
        >
          Remix Todo
        </Typography>
        {username && (
          <Button color="inherit" component={Link} to="/logout">
            Logout ({username})
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
