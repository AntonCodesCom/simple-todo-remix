import { Box, Checkbox, IconButton, TextField } from '@mui/material';
import { Check, CheckCircle, HighlightOff } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { FormEvent, RefObject, useEffect, useRef, useState } from 'react';
import { ActionCell, CheckboxCell, Root, TextCell } from './elements';

// utility
// TODO: better `ref` type definition
function useOutsideClick(ref: RefObject<any>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref && ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

interface Props {
  todo: TodoItem;
  disabled?: boolean;
  onDeactivate?: () => void;
  onEdit?: (label: string) => void;
}

export default function TodoCardEdit({
  todo,
  disabled = false,
  onDeactivate = () => {},
  onEdit = () => {},
}: Props) {
  const { id, label, done } = todo;
  const [text, setText] = useState(label);

  // deactivating editing mode if clicked outside of the card
  const ref = useRef(null);
  useOutsideClick(ref, onDeactivate);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onEdit(text);
  }

  return (
    <Box role="listitem" aria-label={label} id={id}>
      <Root
        ref={ref}
        component="form"
        onSubmit={handleSubmit}
        aria-label="Edit Todo"
      >
        <CheckboxCell>
          <Checkbox
            checkedIcon={<Check />}
            disabled
            defaultChecked={done}
            inputProps={{
              'aria-label': 'Done',
            }}
          />
        </CheckboxCell>
        <TextCell>
          <TextField
            size="small"
            multiline
            fullWidth
            InputProps={{
              sx: {
                p: 0.5,
                lineHeight: 1.5,
              },
            }}
            inputProps={{
              maxLength: 1000,
            }}
            required
            name="label"
            placeholder="Something to do..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length,
              )
            }
          />
        </TextCell>
        <ActionCell>
          <IconButton type="submit" disabled={disabled} aria-label="Edit">
            <CheckCircle color="primary" />
          </IconButton>
        </ActionCell>
        <ActionCell>
          <IconButton
            disabled={disabled}
            onClick={onDeactivate}
            aria-label="Cancel"
          >
            <HighlightOff />
          </IconButton>
        </ActionCell>
      </Root>
    </Box>
  );
}
