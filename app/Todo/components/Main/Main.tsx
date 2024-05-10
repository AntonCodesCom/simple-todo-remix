import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TodoList from '../List';
import TodoItem from '~/Todo/types/Item';
import { Add } from '@mui/icons-material';

interface Props {
  todos: TodoItem[] | null | undefined;
}

export default function TodoMain({ todos }: Props) {
  return (
    <Container>
      <Typography variant="h4" component="h1" mb={2}>
        My Todos
      </Typography>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack direction="row" gap={0.5}>
          <TextField placeholder="Something to do..." size="small" required />
          <Button type="submit" variant="contained" startIcon={<Add />}>
            Add
          </Button>
        </Stack>
      </form>
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
