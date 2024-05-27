import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  IconButton,
  Popover,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Block,
  Close,
  Delete,
  DeleteOutlined,
  Edit,
} from '@mui/icons-material';
import TodoItem from '~/Todo/types/Item';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { useFetcher } from '@remix-run/react';

interface TodoCardDeleteProps {
  disabled?: boolean;
  onDelete?: () => void;
}
function TodoCardDelete({
  disabled = false,
  onDelete = () => {},
}: TodoCardDeleteProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(anchorEl);

  function handlePopoverOpen(e: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handlePopoverClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        disabled={disabled}
        size="small"
        onClick={handlePopoverOpen}
        sx={{
          '&:hover': {
            color: 'error.main',
          },
        }}
      >
        <Delete fontSize="small" />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={popoverOpen}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box maxWidth="20rem" p={1}>
          <Typography variant="body2" textAlign="center" mb={1}>
            Are you sure?
          </Typography>
          <Stack direction="row" gap={0.5}>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteOutlined />}
              onClick={() => {
                handlePopoverClose();
                onDelete();
              }}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Block />}
              onClick={handlePopoverClose}
            >
              No
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}

interface Props {
  todo: TodoItem;
}

export default function TodoCard({ todo }: Props) {
  const { id, label, done } = todo;
  const [checked, setChecked] = useState(done);
  const checkboxHtmlId = `TodoCard_checkbox-${id}`;
  const [editingActive, setEditingActive] = useState(false);
  const checkFetcher = useFetcher();
  const checkLoading = ['loading', 'submitting'].includes(checkFetcher.state);
  const updateFetcher = useFetcher();
  const updateLoading = ['loading', 'submitting'].includes(updateFetcher.state);
  const deleteFetcher = useFetcher();
  const deleteLoading = ['loading', 'submitting'].includes(deleteFetcher.state);
  const loading = checkLoading || updateLoading || deleteLoading;

  function handleDrawerClose() {
    setEditingActive(false);
  }

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    if (loading) {
      return;
    }
    const _done = e.target.checked;
    setChecked(_done);
    checkFetcher.submit(
      {
        done: _done,
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
    <>
      <Stack
        direction="row"
        alignItems="center"
        minHeight="3.25rem"
        sx={{
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          px: 0.25,
          '&:first-child': {
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
  );
}
