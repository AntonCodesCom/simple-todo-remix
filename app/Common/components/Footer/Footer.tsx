import { Box, Container, Link, Stack, Typography } from '@mui/material';

export default function CommonFooter() {
  return (
    <Container component="footer" sx={{ py: 1 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography color="GrayText">Made by AntonCodes</Typography>
        <Box>
          <Link mr={1}>GitHub</Link>
          <Link
            href="https://www.linkedin.com/in/antoncodes/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
