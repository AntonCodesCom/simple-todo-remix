import {
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { Block, Delete, DeleteOutlined } from '@mui/icons-material';
import { MouseEvent, useState } from 'react';

interface Props {
  disabled?: boolean;
  onDelete?: () => void;
}

export default function TodoCardDelete({
  disabled = false,
  onDelete = () => {},
}: Props) {
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
