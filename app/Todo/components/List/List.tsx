import { Box } from '@mui/material';
import TodoItem from '~/Todo/types/Item';
import TodoListItem from './Item';

interface Props {
  todos: TodoItem[];
}

export default function TodoList({ todos }: Props) {
  return (
    <Box display="table" width="100%">
      <Box role="list" display="table-row-group">
        {todos.map((x) => (
          <TodoListItem key={x.id} todo={x} />
        ))}
      </Box>
    </Box>
  );
}
