import { Container, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Todo' },
    { name: 'description', content: 'Remix Todo app.' },
  ];
};

export default function Index() {
  return (
    <Container>
      <Typography variant="h4" component="h1" mb={3}>
        My Todos
      </Typography>
    </Container>
  );
}
