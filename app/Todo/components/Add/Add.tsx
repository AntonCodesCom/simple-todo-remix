import { Add } from '@mui/icons-material';
import { Button, Stack, TextField } from '@mui/material';
import { useFetcher } from '@remix-run/react';

export default function TodoAdd() {
  const fetcher = useFetcher();
  // TODO: loading state
  return (
    <fetcher.Form method="POST" action="add">
      <Stack direction="row" gap={0.5}>
        <TextField
          name="label"
          placeholder="Something to do..."
          size="small"
          required
        />
        <Button type="submit" variant="contained" startIcon={<Add />}>
          Add
        </Button>
      </Stack>
    </fetcher.Form>
  );
}
