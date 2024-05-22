import { Box, Checkbox, IconButton, Stack, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { useState } from 'react';
import styles from './Item.module.css';

interface Props {
  todo: TodoItem;
}

export default function TodoListItem({ todo }: Props) {
  const { id, label, done } = todo;
  const htmlId = `TodoListItem_${id}`;
  const [editingActive, setEditingActive] = useState(false);

  return (
    <Box role="listitem" className={styles.root}>
      <Box
        sx={{
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          px: 0.25,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          minHeight="3.25rem"
          component="form"
          onSubmit={(e) => e.preventDefault()}
        >
          <Checkbox id={htmlId} defaultChecked={done} />
          <Box flex={1} pr={1}>
            <Typography
              variant="body2"
              component="label"
              htmlFor={htmlId}
              sx={{
                display: 'block',
                cursor: 'pointer',
                p: 1,
                pl: 0.5,
              }}
            >
              {label}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setEditingActive((x) => !x)}>
            <Edit fontSize="small" />
          </IconButton>
          <Box pl={0.25} />
          <IconButton size="small">
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
