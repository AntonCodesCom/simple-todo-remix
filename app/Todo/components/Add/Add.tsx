import { Add } from '@mui/icons-material';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

// sub-component
function LoadingIcon() {
  return (
    <Box display="inline-block" lineHeight={1} mx={0.12}>
      <CircularProgress color="inherit" size="1rem" />
    </Box>
  );
}

/**
 * "Add todo" form component.
 */
export default function TodoAdd() {
  const fetcher = useFetcher();
  const [label, setLabel] = useState('');
  const loading = fetcher.state === 'submitting' || fetcher.state === 'loading';

  useEffect(() => {
    if (fetcher.state === 'idle') {
      setLabel('');
    }
  }, [fetcher.state]);

  return (
    <fetcher.Form method="POST" action="add" aria-label="Add Todo">
      <Stack direction="row" gap={0.5}>
        <TextField
          name="label"
          placeholder="Something to do..."
          size="small"
          fullWidth
          required
          inputProps={{ maxLength: 1000 }}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={loading ? <LoadingIcon /> : <Add />}
          disabled={loading}
        >
          Add
        </Button>
      </Stack>
    </fetcher.Form>
  );
}
