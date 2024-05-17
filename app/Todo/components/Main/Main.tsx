import { Box, Container, Typography } from '@mui/material';
import TodoList from '../List';
import TodoItem from '~/Todo/types/Item';
import TodoAdd from '../Add';

interface Props {
  todos: TodoItem[] | null | undefined;
}

export default function TodoMain({ todos }: Props) {
  return (
    <Container>
      <Typography variant="h4" component="h1" mb={2}>
        My Todos
      </Typography>
      <TodoAdd />
      <Box mb={1.5} />
      {todos && todos.length > 0 ? (
        <TodoList todos={todos} />
      ) : (
        <Typography variant="body2" color="GrayText">
          No todos yet. Add one!
        </Typography>
      )}
    </Container>
  );
}
