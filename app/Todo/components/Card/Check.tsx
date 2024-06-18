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

  // whether to show the loading state visually
  const [loadingVisible, setLoadingVisible] = useState(false);

  useEffect(() => {
    setLoadingVisible(false);
  }, [disabled]);

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
    <Root className={loadingVisible ? styles.loadingVisible : undefined}>
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
        />
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
