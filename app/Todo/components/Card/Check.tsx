import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { ChangeEvent, ReactElement, useState } from 'react';

interface Props {
  todo: TodoItem;
  DeleteElement: ReactElement;
  onEditClick?: () => void;
  onCheckToggle?: (done: boolean) => void;
}

export default function TodoCardCheck({
  todo,
  DeleteElement,
  onEditClick = () => {},
  onCheckToggle = () => {},
}: Props) {
  const { id, label, done } = todo;
  const checkboxHtmlId = `TodoCard_checkbox-${id}`;
  const [checked, setChecked] = useState(done);

  const checkLoading = false; // TODO
  const loading = false; // TODO

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (loading) {
      return;
    }
    const _done = e.target.checked;
    setChecked(_done);
    onCheckToggle(_done);
  }

  return (
    <Stack direction="row" alignItems="center" minHeight="3.25rem">
      {checkLoading ? (
        <Stack direction="row" alignItems="center" p={0.7}>
          <CircularProgress size="1.2rem" sx={{ color: 'text.disabled' }} />
        </Stack>
      ) : (
        <Checkbox
          disabled={loading}
          id={checkboxHtmlId}
          checked={checked}
          onChange={handleCheckboxChange}
        />
      )}
      <Box flex={1} pr={1}>
        <Typography
          variant="body2"
          component="label"
          htmlFor={checkboxHtmlId}
          sx={{
            display: 'block',
            cursor: 'pointer',
            p: 1,
            pl: 0.5,
            color: loading ? 'text.disabled' : 'inherit',
            fontWeight: checked ? 400 : 500,
            textDecoration: checked ? 'line-through' : 'none',
          }}
        >
          {label}
        </Typography>
      </Box>
      <IconButton disabled={loading} size="small" onClick={onEditClick}>
        <Edit fontSize="small" />
      </IconButton>
      <Box pl={0.25} />
      {DeleteElement}
    </Stack>
  );
}
