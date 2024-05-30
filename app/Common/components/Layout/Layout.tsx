import { Box, Stack } from '@mui/material';
import CommonHeader from '../Header';
import CommonFooter from '../Footer';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function CommonLayout({ children }: Props) {
  return (
    <Stack direction="column" minHeight="100vh">
      <CommonHeader />
      <Box mb={3} />
      <Box component="main" flex={1} mb={3}>
        {children}
      </Box>
      <CommonFooter />
    </Stack>
  );
}
