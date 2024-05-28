import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { Check, EditOutlined } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { ChangeEvent, ReactElement, useState } from 'react';
import { CheckboxCell, Root, TextCell } from './elements';

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
    <Root>
      <CheckboxCell>
        {checkLoading ? (
          <CircularProgress size="1.2rem" sx={{ color: 'text.disabled' }} />
        ) : (
          <Checkbox
            checkedIcon={<Check />}
            sx={{
              color: 'primary.main',
              '&.Mui-checked': {
                color: 'text.secondary',
              },
            }}
            disabled={disabled}
            id={checkboxHtmlId}
            checked={checked}
            onChange={handleCheckboxChange}
          />
        )}
      </CheckboxCell>
      <TextCell>
        <Typography
          component="label"
          htmlFor={checkboxHtmlId}
          sx={{
            display: 'block',
            p: 0.5,
            color: disabled
              ? 'text.disabled'
              : done
                ? 'text.secondary'
                : 'text.primary',
            textDecoration: checked ? 'line-through' : 'none',
            cursor: 'pointer',
          }}
        >
          {label}
        </Typography>
      </TextCell>
      <IconButton disabled={disabled} size="small" onClick={onEditClick}>
        <EditOutlined fontSize="small" />
      </IconButton>
      <Box pl={0.25} />
      {DeleteElement}
    </Root>
  );
}
