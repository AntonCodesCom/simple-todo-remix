import {
  Checkbox,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { Check, EditOutlined } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { ActionCell, CheckboxCell, Root, TextCell } from './elements';

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
  const [loading1, setLoading1] = useState(false);

  const checkLoading = false; // TODO

  useEffect(() => {
    setChecked(done);
    setLoading1(false);
  }, [done]);

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (loading1) {
      return;
    }
    setLoading1(true);
    const _done = e.target.checked;
    onCheckToggle(_done);
  }

  function handleEditClick() {
    if (loading1) {
      return;
    }
    onEditClick();
  }

  return (
    <Root>
      <CheckboxCell>
        {checkLoading ? (
          <CircularProgress size="1.2rem" sx={{ color: 'text.disabled' }} />
        ) : (
          <Checkbox
            disableTouchRipple
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
            flex: 1,
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
      <ActionCell>
        <IconButton disabled={disabled} onClick={handleEditClick}>
          <EditOutlined fontSize="small" />
        </IconButton>
      </ActionCell>
      <ActionCell>{DeleteElement}</ActionCell>
    </Root>
  );
}
