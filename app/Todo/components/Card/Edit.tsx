import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { ChangeEvent, ReactElement, useState } from 'react';

interface Props {
  todo: TodoItem;
  onCloseClick?: () => void;
}

export default function TodoCardEdit({ todo, onCloseClick = () => {} }: Props) {
  const { label, done } = todo;

  const loading = false; // TODO

  return (
    <Stack direction="row" alignItems="center" minHeight="3.25rem">
      <Checkbox disabled defaultChecked={done} />
      <Box flex={1} pr={1}>
        <Typography
          variant="body2"
          sx={{
            display: 'block',
            p: 1,
            pl: 0.5,
            color: 'text.disabled',
          }}
        >
          {label}
        </Typography>
      </Box>
      <IconButton
        disabled={loading}
        size="small"
        onClick={() => {
          // TODO
        }}
      >
        <Edit fontSize="small" />
      </IconButton>
      <Box pl={0.25} />
      <IconButton disabled={loading} size="small" onClick={onCloseClick}>
        <Close fontSize="small" />
      </IconButton>
    </Stack>
  );
}
