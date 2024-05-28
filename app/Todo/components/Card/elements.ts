import { Stack, StackProps, styled } from '@mui/material';

export const Root = styled(Stack)<StackProps>(({ theme }) => ({
  alignItems: 'center',
  minHeight: '3.25rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '0 0.25rem',
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  '&:hover': {
    backgroundColor: '#fafafa', // TODO: theme color
  },
}));

export const CheckboxCell = styled(Stack)({});
