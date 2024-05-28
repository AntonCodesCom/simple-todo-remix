import { Box, Checkbox, IconButton, Stack, TextField } from '@mui/material';
import { Check, CheckCircle, HighlightOff } from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { FormEvent, RefObject, useEffect, useRef, useState } from 'react';
import { CheckboxCell, Root, TextCell } from './elements';

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
  const { label, done } = todo;
  const [text, setText] = useState(label);

  // deactivating editing mode if clicked outside of the card
  const ref = useRef(null);
  useOutsideClick(ref, onDeactivate);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onEdit(text);
  }

  return (
    <Root ref={ref} component="form" onSubmit={handleSubmit}>
      <CheckboxCell>
        <Checkbox checkedIcon={<Check />} disabled defaultChecked={done} />
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
          required
          name="label"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
      </TextCell>
      <IconButton type="submit" disabled={disabled} size="small">
        <CheckCircle color="primary" />
      </IconButton>
      <Box pl={0.025} />
      <IconButton disabled={disabled} size="small" onClick={onDeactivate}>
        <HighlightOff />
      </IconButton>
    </Root>
  );
}
