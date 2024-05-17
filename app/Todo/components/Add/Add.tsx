import { Add } from '@mui/icons-material';
import { Button, Stack, TextField } from '@mui/material';

export default function TodoAdd() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack direction="row" gap={0.5}>
        <TextField placeholder="Something to do..." size="small" required />
        <Button type="submit" variant="contained" startIcon={<Add />}>
          Add
        </Button>
      </Stack>
    </form>
  );
}
