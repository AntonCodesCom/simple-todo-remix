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

  const Icon = () => (loading ? <LoadingIcon /> : <Add />);

  return (
    <fetcher.Form method="POST" action="add" aria-label="Add Todo">
      <Stack direction="row" gap={{ xs: 0.25, sm: 0.5 }}>
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
          disabled={loading}
          sx={{
            display: { xs: 'inherit', sm: 'none' },
            minWidth: '2.75rem',
            paddingX: 0.75,
          }}
        >
          <Icon />
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Icon />}
          disabled={loading}
          sx={{
            display: { xs: 'none', sm: 'inherit' },
          }}
        >
          Add
        </Button>
      </Stack>
    </fetcher.Form>
  );
}
