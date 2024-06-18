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
import styles from './Check.module.css';

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

  // whether to show the loading state visually
  const [loadingVisible, setLoadingVisible] = useState(false);

  useEffect(() => {
    setLoadingVisible(false);
  }, [disabled]);

  // useEffect(() => {
  //   setChecked(done);
  //   setLoading1(false);
  //   setLoading2(false);
  //   clearTimeout(timeout2);
  //   setTimeout2(undefined);
  // }, [done]);

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (loading1 || loading2 || disabled) {
      setLoadingVisible(true);
      return;
    }
    // setLoading1(true);
    // setTimeout2(
    //   setTimeout(() => {
    //     setLoading2(true);
    //   }, delay2),
    // );
    const _done = e.target.checked;
    setChecked(_done);
    onCheckToggle(_done);
  }

  function handleEditClick() {
    if (loading1 || loading2 || disabled) {
      setLoadingVisible(true);
      return;
    }
    onEditClick();
  }

  // TODO: delete button onClick setLoadingVisible(true)

  return (
    <Root className={loadingVisible ? styles.loadingVisible : undefined}>
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
                color: 'action.active',
              },
              '&.Mui-disabled': {
                color: checked ? 'action.active' : 'primary.main',
              },
            }}
            // disabled={disabledVisible}
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
            color: checked ? 'text.secondary' : 'text.primary',
            textDecoration: checked ? 'line-through' : 'none',
            cursor: 'pointer',
          }}
        >
          {label}
        </Typography>
      </TextCell>
      <ActionCell>
        <IconButton
          // disabled={disabledVisible}
          onClick={handleEditClick}
          aria-label="Edit"
          sx={{
            cursor: 'pointer',
            '&.Mui-disabled': {
              color: 'action.active',
            },
          }}
        >
          <EditOutlined fontSize="small" />
        </IconButton>
      </ActionCell>
      <ActionCell>
        {disabled ? (
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
