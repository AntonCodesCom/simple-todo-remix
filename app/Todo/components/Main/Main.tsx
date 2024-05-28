import { Box, Container, Grid, Typography } from '@mui/material';
import TodoItem from '~/Todo/types/Item';
import TodoAdd from '../Add';
import TodoCard from '../Card';

interface Props {
  todos: TodoItem[] | null | undefined;
}

export default function TodoMain({ todos }: Props) {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" mb={2}>
            My Todos
          </Typography>
          <TodoAdd />
          <Box mb={1.5} />
          {todos && todos.length > 0 ? (
            <Box role="list" width="100%">
              {todos.map((x) => (
                <TodoCard key={x.id} todo={x} />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="GrayText">
              No todos yet. Add one!
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
