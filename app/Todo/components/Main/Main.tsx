import { Box, Container, Grid, Typography } from '@mui/material';
import TodoItem from '~/Todo/types/Item';
import TodoAdd from '../Add';
import TodoCard from '../Card';

interface Props {
  todos: TodoItem[] | null | undefined;
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
              data-idhash="59c77e6c1b8d6c834d3c225b1b968af3"
              role="list"
              aria-labelledby={headingHtmlId}
              width="100%"
            >
              {/* TODO: fix hard-coded id hash */}
              {todos.map((x) => (
                // TODO: role listitem
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
