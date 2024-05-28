import { Stack, StackProps, styled } from '@mui/material';

export const Root = styled(Stack)<StackProps>(({ theme }) => ({
  alignItems: 'center',
  minHeight: '3.25rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:first-of-type': {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  '&:hover': {
    backgroundColor: '#fafafa', // TODO: theme color
  },
}));

export const CheckboxCell = styled(Stack)({});
