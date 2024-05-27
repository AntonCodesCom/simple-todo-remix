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
import styles from './Card.module.css';
import { useFetcher } from '@remix-run/react';

interface Props {
  todo: TodoItem;
}

export default function TodoCard({ todo }: Props) {
  const { id, label, done } = todo;
  const [checked, setChecked] = useState(done);
  const checkboxHtmlId = `TodoCard_checkbox-${id}`;
  const popoverHtmlId = `TodoCard_popover-${id}`;
  const [editingActive, setEditingActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(anchorEl);
  const checkFetcher = useFetcher();
  const checkLoading = ['loading', 'submitting'].includes(checkFetcher.state);
  const updateFetcher = useFetcher();
  const updateLoading = ['loading', 'submitting'].includes(updateFetcher.state);
  const deleteFetcher = useFetcher();
  const deleteLoading = ['loading', 'submitting'].includes(deleteFetcher.state);
  const loading = checkLoading || updateLoading || deleteLoading;

  function handlePopoverOpen(e: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handlePopoverClose() {
    setAnchorEl(null);
  }
  function handleDrawerClose() {
    setEditingActive(false);
  }

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const _done = e.target.checked;
    setChecked(_done);
    checkFetcher.submit(
      {
        done: _done,
      },
      { action: `update/${id}`, method: 'POST' },
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
        }}
        className={styles.root}
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
        <IconButton
          disabled={loading}
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
      </Stack>
      <Popover
        id={popoverHtmlId}
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
          <Stack
            direction="row"
            gap={0.5}
            component={deleteFetcher.Form}
            action={`delete/${id}`}
            method="POST"
          >
            <Button
              type="submit"
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteOutlined />}
              onClick={handlePopoverClose}
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
