import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import styles from './List.module.css';
import { Delete, Edit } from '@mui/icons-material';

const todos = [
  {
    label: 'Lorem ipsum dolor sit amet.',
  },
  {
    label: 'Todo 2',
  },
  {
    label: 'Todo 3',
  },
];

export default function TodoList() {
  return (
    <>
      <Box display="table">
        <Box display="table-row-group">
          {todos.map((x, i) => {
            const htmlId = `TodoList-item_${i}`;
            return (
              <Box key={i} display="table-row" className={styles.row}>
                <Box display="table-cell" className={styles.cell}>
                  <Checkbox id={htmlId} />
                </Box>
                <Box className={styles.cell} display="table-cell" pr={1}>
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor={htmlId}
                    sx={{ display: 'block', cursor: 'pointer', p: 1, pl: 0.5 }}
                  >
                    {x.label}
                  </Typography>
                </Box>
                <Box display="table-cell" className={styles.cell}>
                  <IconButton size="small">
                    <Edit fontSize="small" />
                  </IconButton>{' '}
                  <IconButton size="small">
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
