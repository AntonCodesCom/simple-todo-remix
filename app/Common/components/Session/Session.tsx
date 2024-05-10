import {
  Box,
  Button,
  ButtonBase,
  Container,
  Link,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { MouseEvent, useEffect, useState } from 'react';

interface Props {
  sessionId: string;
}

export default function CommonSession({ sessionId }: Props) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'CommonSession-popover' : undefined;

  useEffect(() => {
    if (tooltipOpen) {
      const timeout = setTimeout(() => {
        setTooltipOpen(false);
      }, 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [tooltipOpen]);

  function handlePopoverOpen(e: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handlePopoverClose() {
    setAnchorEl(null);
  }
  function handleCopy() {
    navigator.clipboard.writeText(sessionId);
    setTooltipOpen(true);
  }

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        mb={1}
      >
        <Typography variant="body2" color="GrayText">
          Your session ID is:{' '}
          <Tooltip open={tooltipOpen} title="Copied" placement="top" arrow>
            <ButtonBase
              style={{
                fontWeight: 500,
                textDecoration: 'underline',
              }}
              onClick={handleCopy}
            >
              {sessionId}
            </ButtonBase>
          </Tooltip>{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            (
            <Link
              variant="button"
              component="button"
              sx={{ display: 'inline-block', px: 0.15 }}
              aria-describedby={id}
              onClick={handlePopoverOpen}
            >
              ?
            </Link>
            )
          </span>
        </Typography>
      </Stack>
      <Popover
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box maxWidth="20rem" p={1}>
          <Typography variant="body2" mb={1}>
            This is your session identifier which your todos are associated
            with.
          </Typography>
          <Typography variant="body2" mb={1}>
            To open this session in a different browser, copy the session link
            and paste it in the browser address bar.
          </Typography>
          <Stack direction="row" gap={0.5}>
            <Button
              variant="contained"
              sx={{ color: 'white' }}
              onClick={() => {
                handleCopy();
                handlePopoverClose();
              }}
            >
              Copy link
            </Button>
            <Button variant="outlined" onClick={handlePopoverClose}>
              Dismiss
            </Button>
          </Stack>
        </Box>
      </Popover>
    </Container>
  );
}
