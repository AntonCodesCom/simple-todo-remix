import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import TodoItem from '~/Todo/types/Item';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import TodoCardDelete from './Delete';
import TodoCardCheck from './Check';
import TodoCardEdit from './Edit';

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

// props
interface Props {
  todo: TodoItem;
}

/**
 * Todo card component.
 */
export default function TodoCard({ todo }: Props) {
  const { id, done } = todo;
  // const [checked, setChecked] = useState(done);
  const checkboxHtmlId = `TodoCard_checkbox-${id}`;
  const [editingActive, setEditingActive] = useState(false);
  const checkFetcher = useFetcher();
  const checkLoading = ['loading', 'submitting'].includes(checkFetcher.state);
  const updateFetcher = useFetcher();
  const updateLoading = ['loading', 'submitting'].includes(updateFetcher.state);
  const deleteFetcher = useFetcher();
  const deleteLoading = ['loading', 'submitting'].includes(deleteFetcher.state);
  const loading = checkLoading || updateLoading || deleteLoading;
  const ref = useRef(null);

  // closing editing mode if clicked outside of the card
  useOutsideClick(ref, () => setEditingActive(false));

  function handleDrawerClose() {
    setEditingActive(false);
  }

  function handleCheckToggle(_done: boolean) {
    if (loading) {
      return;
    }
    checkFetcher.submit(
      {
        done: _done,
      },
      { action: `update/${id}`, method: 'POST' },
    );
  }

  function handleEdit(_label: string) {
    if (loading) {
      return;
    }
    setEditingActive(false);
    updateFetcher.submit(
      {
        label: _label,
      },
      { action: `update/${id}`, method: 'POST' },
    );
  }

  function handleDelete() {
    if (loading) {
      return;
    }
    deleteFetcher.submit(
      {},
      {
        action: `delete/${id}`,
        method: 'POST',
      },
    );
  }

  return (
    <Box
      ref={ref}
      sx={{
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        px: 0.25,
        '&:first-of-type': {
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        },
        '&:hover': {
          backgroundColor: '#fafafa', // TODO: theme color
        },
      }}
    >
      {editingActive ? (
        <TodoCardEdit
          todo={todo}
          disabled={loading}
          onCloseClick={() => setEditingActive(false)}
          onEdit={handleEdit}
        />
      ) : (
        <TodoCardCheck
          todo={todo}
          DeleteElement={
            <TodoCardDelete disabled={loading} onDelete={handleDelete} />
          }
          onEditClick={() => setEditingActive(true)}
          disabled={loading}
          onCheckToggle={handleCheckToggle}
        />
      )}
    </Box>
  );

  /*return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        minHeight="3.25rem"
        sx={{
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          px: 0.25,
          '&:first-of-type': {
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          },
          '&:hover': {
            backgroundColor: '#fafafa', // TODO: theme color
          },
        }}
      >
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
        <IconButton
          disabled={loading}
          size="small"
          onClick={() => setEditingActive((x) => !x)}
        >
          <Edit fontSize="small" />
        </IconButton>
        <Box pl={0.25} />
        <TodoCardDelete disabled={loading} onDelete={handleDelete} />
      </Stack>
      <Drawer
        anchor="right"
        hideBackdrop
        open={editingActive}
        onClose={handleDrawerClose}
      >
        <Toolbar disableGutters>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            pl={1.5}
            pr={0.75}
          >
            <Typography variant="h6" component="h2">
              Update Todo
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <Close />
            </IconButton>
          </Stack>
        </Toolbar>
        <Box px={1.5} pt={1}>
          <updateFetcher.Form action={`update/${id}`} method="POST">
            <TextField
              multiline
              rows={3}
              fullWidth
              size="small"
              name="label"
              placeholder="Something to do..."
              required
              defaultValue={label}
            />
            <Box mb={1.5} />
            <Stack direction="row" gap={0.5}>
              <Button
                type="submit"
                variant="contained"
                onClick={handleDrawerClose}
              >
                Update
              </Button>
              <Button variant="outlined" onClick={handleDrawerClose}>
                Cancel
              </Button>
            </Stack>
          </updateFetcher.Form>
        </Box>
      </Drawer>
    </>
  );*/
}
