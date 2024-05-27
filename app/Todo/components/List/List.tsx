import { Box } from '@mui/material';
import TodoItem from '~/Todo/types/Item';
import TodoCard from '../Card/Card';

interface Props {
  todos: TodoItem[];
}

export default function TodoList({ todos }: Props) {
  return (
    <Box display="table" width="100%">
      <Box role="list" display="table-row-group">
        {todos.map((x) => (
          <TodoCard key={x.id} todo={x} />
        ))}
      </Box>
    </Box>
  );
}
