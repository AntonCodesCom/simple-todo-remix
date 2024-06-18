import {
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { Block, DeleteOutlined } from '@mui/icons-material';
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
  const dialogLabelHtmlId = 'TodoCardDelete-dialog_label';

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
        onClick={handlePopoverOpen}
        sx={{
          '&:hover': {
            color: !disabled ? 'error.main' : undefined,
          },
        }}
        aria-label="Delete"
      >
        <DeleteOutlined fontSize="small" />
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
        <Box
          maxWidth="20rem"
          p={1}
          role="dialog"
          aria-labelledby={dialogLabelHtmlId}
        >
          <Typography
            id={dialogLabelHtmlId}
            variant="body2"
            textAlign="center"
            mb={1}
          >
            Delete this Todo?
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
