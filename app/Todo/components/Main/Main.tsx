import { Container, Typography } from '@mui/material';
import TodoList from '../List';
import TodoItem from '~/Todo/types/Item';

interface Props {
  todos: TodoItem[] | null | undefined;
}

export default function TodoMain({ todos }: Props) {
  return (
    <Container>
      <Typography variant="h4" component="h1" mb={3}>
        My Todos
      </Typography>
      {todos && <TodoList todos={todos} />}
    </Container>
  );
}
