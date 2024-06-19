import { Checkbox, IconButton, Typography } from '@mui/material';
import { Check, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { ActionCell, CheckboxCell, Root, TextCell } from './elements';
import styles from './Check.module.css';

interface Props {
  todo: TodoItem;
  deleteElement?: ReactElement | null;
  disabled?: boolean;
  deleting?: boolean;
  onEditClick?: () => void;
  onCheckToggle?: (done: boolean) => void;
}

export default function TodoCardCheck({
  todo,
  deleteElement = null,
  disabled = false,
  deleting = false,
  onEditClick = () => {},
  onCheckToggle = () => {},
}: Props) {
  const { id, label, done } = todo;
  const checkboxHtmlId = `TodoCard-checkbox_${id}`;
  const labelHtmlId = `TodoCard-label_${id}`;
  const [checked, setChecked] = useState(done);

  // whether to show the loading state visually
  const [loadingVisible, setLoadingVisible] = useState(false);

  useEffect(() => {
    setLoadingVisible(false);
  }, [disabled]);

  useEffect(() => {
    deleting && setLoadingVisible(true);
  }, [deleting]);

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (disabled) {
      setLoadingVisible(true);
      return;
    }
    const _done = e.target.checked;
    setChecked(_done);
    onCheckToggle(_done);
  }

  function handleEditClick() {
    if (disabled) {
      setLoadingVisible(true);
      return;
    }
    onEditClick();
  }

  return (
    <Root
      role="listitem"
      aria-labelledby={labelHtmlId}
      id={id}
      className={loadingVisible ? styles.loadingVisible : undefined}
      aria-disabled={disabled ? 'true' : 'false'}
    >
      <CheckboxCell>
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
          disabled={loadingVisible}
          id={checkboxHtmlId}
          checked={checked}
          onChange={handleCheckboxChange}
          inputProps={{
            'aria-label': 'Done',
          }}
        />
      </CheckboxCell>
      <TextCell>
        <Typography
          component="label"
          role="none"
          id={labelHtmlId}
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
          disabled={loadingVisible}
          onClick={handleEditClick}
          aria-label="Edit"
          sx={{
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
          <IconButton
            aria-label="Delete"
            disabled={loadingVisible}
            onClick={() => setLoadingVisible(true)}
            sx={{
              '&.Mui-disabled': {
                color: 'action.active',
              },
            }}
          >
            <DeleteOutlined fontSize="small" />
          </IconButton>
        ) : (
          deleteElement
        )}
      </ActionCell>
    </Root>
  );
}
