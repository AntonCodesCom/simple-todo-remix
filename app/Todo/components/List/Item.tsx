import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { Block, Delete, DeleteOutlined, Edit } from '@mui/icons-material';
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
              }}
            >
              {label}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setEditingActive((x) => !x)}>
            <Edit fontSize="small" />
          </IconButton>
          <Box pl={0.25} />
          <IconButton size="small" onClick={handlePopoverOpen}>
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
    </Box>
  );
}
