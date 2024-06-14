import { Box, Container, Grid, Typography } from '@mui/material';
import TodoItem from '~/Todo/types/Item';
import TodoAdd from '../Add';
import TodoCard from '../Card';
import arrayIdHash from '~/Common/utils/arrayIdHash';

interface Props {
  todos: TodoItem[];
}

export default function TodoMain({ todos }: Props) {
  const headingHtmlId = 'TodoMain-h1';
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={8}>
          <Typography id={headingHtmlId} variant="h4" component="h1" mb={2}>
            My Todos
          </Typography>
          <TodoAdd />
          <Box mb={1.5} />
          {todos && todos.length > 0 ? (
            <Box
              data-idhash={arrayIdHash(todos)}
              role="list"
              aria-labelledby={headingHtmlId}
              width="100%"
            >
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
