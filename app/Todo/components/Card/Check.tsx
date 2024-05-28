import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Edit, EditOutlined } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { ChangeEvent, ReactElement, useState } from 'react';

interface Props {
  todo: TodoItem;
  DeleteElement: ReactElement;
  disabled?: boolean;
  onEditClick?: () => void;
  onCheckToggle?: (done: boolean) => void;
}

export default function TodoCardCheck({
  todo,
  DeleteElement,
  disabled = false,
  onEditClick = () => {},
  onCheckToggle = () => {},
}: Props) {
  const { id, label, done } = todo;
  const checkboxHtmlId = `TodoCard_checkbox-${id}`;
  const [checked, setChecked] = useState(done);

  const checkLoading = false; // TODO

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
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
          disabled={disabled}
          id={checkboxHtmlId}
          checked={checked}
          onChange={handleCheckboxChange}
        />
      )}
      <Box flex={1} pr={1}>
        <Typography
          component="label"
          htmlFor={checkboxHtmlId}
          sx={{
            display: 'inline-block',
            cursor: 'pointer',
            p: 1,
            pl: 0.5,
            color: disabled
              ? 'text.disabled'
              : done
                ? 'text.secondary'
                : 'text.primary',
            textDecoration: checked ? 'line-through' : 'none',
            lineHeight: 1.5,
          }}
        >
          {label}
        </Typography>
      </Box>
      <IconButton disabled={disabled} size="small" onClick={onEditClick}>
        <EditOutlined fontSize="small" />
      </IconButton>
      <Box pl={0.25} />
      {DeleteElement}
    </Stack>
  );
}
