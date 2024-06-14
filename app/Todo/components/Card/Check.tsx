import {
  Checkbox,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { Check, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { ActionCell, CheckboxCell, Root, TextCell } from './elements';

interface Props {
  todo: TodoItem;
  deleteElement: ReactElement;
  disabled?: boolean;
  onEditClick?: () => void;
  onCheckToggle?: (done: boolean) => void;
}

export default function TodoCardCheck({
  todo,
  deleteElement,
  disabled = false,
  onEditClick = () => {},
  onCheckToggle = () => {},
}: Props) {
  const { id, label, done } = todo;
  const checkboxHtmlId = `TodoCard_checkbox-${id}`;
  const [checked, setChecked] = useState(done);

  // invisible loading state (stage 1)
  const [loading1, setLoading1] = useState(false);

  // visible loading state (stage 2)
  const [loading2, setLoading2] = useState(false);
  const [timeout2, setTimeout2] = useState<NodeJS.Timeout>();
  const delay2 = 200;

  // whether to show the disabled state visually
  const disabledVisible = disabled || loading2;

  useEffect(() => {
    setChecked(done);
    setLoading1(false);
    setLoading2(false);
    clearTimeout(timeout2);
    setTimeout2(undefined);
  }, [done]);

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    setChecked((x) => !x); // TODO: remove this and uncomment the rest
    // if (loading1 || loading2 || disabled) {
    //   return;
    // }
    // setLoading1(true);
    // setTimeout2(
    //   setTimeout(() => {
    //     setLoading2(true);
    //   }, delay2),
    // );
    // const _done = e.target.checked;
    // onCheckToggle(_done);
  }

  function handleEditClick() {
    if (loading1 || loading2 || disabled) {
      return;
    }
    onEditClick();
  }

  return (
    <Root>
      <CheckboxCell>
        {loading2 ? (
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
            disabled={disabledVisible}
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
            color: disabledVisible
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
        <IconButton disabled={disabledVisible} onClick={handleEditClick}>
          <EditOutlined fontSize="small" />
        </IconButton>
      </ActionCell>
      <ActionCell>
        {loading1 ? (
          <IconButton disabled={loading2}>
            <DeleteOutlined fontSize="small" />
          </IconButton>
        ) : (
          deleteElement
        )}
      </ActionCell>
    </Root>
  );
}
