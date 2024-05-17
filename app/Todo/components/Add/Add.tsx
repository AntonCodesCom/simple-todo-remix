import { Add } from '@mui/icons-material';
import { Button, Stack, TextField } from '@mui/material';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

export default function TodoAdd() {
  const fetcher = useFetcher();
  const [label, setLabel] = useState('');

  // TODO: loading state

  useEffect(() => {
    if (fetcher.state === 'idle') {
      setLabel('');
    }
  }, [fetcher.state]);

  return (
    <fetcher.Form method="POST" action="add">
      <Stack direction="row" gap={0.5}>
        <TextField
          name="label"
          placeholder="Something to do..."
          size="small"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Button type="submit" variant="contained" startIcon={<Add />}>
          Add
        </Button>
      </Stack>
    </fetcher.Form>
  );
}
