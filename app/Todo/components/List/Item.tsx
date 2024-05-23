import {
  Box,
  Button,
  Checkbox,
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
import { MouseEvent, useState } from 'react';
import styles from './Item.module.css';

interface Props {
  todo: TodoItem;
}

export default function TodoListItem({ todo }: Props) {
  const { id, label, done } = todo;
  const checkboxHtmlId = `TodoListItem_checkbox-${id}`;
  const popoverHtmlId = `TodoListItem_popover-${id}`;
  const [editingActive, setEditingActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(anchorEl);

  function handlePopoverOpen(e: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handlePopoverClose() {
    setAnchorEl(null);
  }
  function handleDrawerClose() {
    setEditingActive(false);
  }

  return (
    <Box role="listitem" className={styles.root}>
      <Box
        sx={{
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          px: 0.25,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          minHeight="3.25rem"
          component="form"
          onSubmit={(e) => e.preventDefault()}
        >
          <Checkbox id={checkboxHtmlId} defaultChecked={done} />
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
                textDecoration: done ? 'line-through' : 'none',
              }}
              fontWeight={done ? 400 : 500}
            >
              {label}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setEditingActive((x) => !x)}>
            <Edit fontSize="small" />
          </IconButton>
          <Box pl={0.25} />
          <IconButton
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
      </Box>
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
          <Stack direction="row" gap={0.5}>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteOutlined />}
              onClick={() => {
                handlePopoverClose();
                // TODO: deletion
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
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              multiline
              rows={3}
              fullWidth
              size="small"
              name="label"
              placeholder="Something to do..."
              required
              value={label}
            />
            <Box mb={1.5} />
            <Stack direction="row" gap={0.5}>
              <Button variant="contained">Update</Button>
              <Button variant="outlined" onClick={handleDrawerClose}>
                Cancel
              </Button>
            </Stack>
          </form>
        </Box>
      </Drawer>
    </Box>
  );
}
