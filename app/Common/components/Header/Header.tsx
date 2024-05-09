import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link } from '@remix-run/react';

export default function CommonHeader() {
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
        <Button component={Link} to="/about" sx={{ color: 'white' }}>
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
}
