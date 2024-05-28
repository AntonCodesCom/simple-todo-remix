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

export const CheckboxCell = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.75rem',
});

export const TextCell = styled(Stack)({
  flex: 1,
  alignItems: 'center',
  padding: '0.5rem',
  paddingLeft: 0,
});

export const ActionCell = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
});
