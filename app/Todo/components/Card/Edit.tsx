import { Box, Checkbox, IconButton, Stack, TextField } from '@mui/material';
import { CheckCircle, HighlightOff } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { FormEvent, useState } from 'react';

interface Props {
  todo: TodoItem;
  disabled?: boolean;
  onCloseClick?: () => void;
  onEdit?: (label: string) => void;
}

export default function TodoCardEdit({
  todo,
  disabled = false,
  onCloseClick = () => {},
  onEdit = () => {},
}: Props) {
  const { label, done } = todo;
  const [text, setText] = useState(label);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onEdit(text);
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      minHeight="3.25rem"
      component="form"
      onSubmit={handleSubmit}
    >
      <Checkbox disabled defaultChecked={done} />
      <Box flex={1} pr={1} py={0.475}>
        <TextField
          size="small"
          multiline
          fullWidth
          InputProps={{
            sx: {
              pl: 0.5,
              lineHeight: 1.5,
            },
          }}
          required
          name="label"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
      </Box>
      <IconButton type="submit" disabled={disabled} size="small">
        <CheckCircle color="primary" />
      </IconButton>
      <Box pl={0.025} />
      <IconButton disabled={disabled} size="small" onClick={onCloseClick}>
        <HighlightOff />
      </IconButton>
    </Stack>
  );
}
