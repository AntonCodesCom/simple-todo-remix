import { Container, Link, Stack, Typography } from '@mui/material';

interface Props {
  sessionId: string;
}

export default function CommonSession({ sessionId }: Props) {
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
          <span style={{ fontWeight: 500 }}>{sessionId}</span> (
          <Link variant="button" sx={{ display: 'inline-block', px: 0.15 }}>
            ?
          </Link>
          )
        </Typography>
      </Stack>
    </Container>
  );
}
