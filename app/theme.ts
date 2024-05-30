import { colors, createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiContainer: {
      defaultProps: {
        fixed: true,
        maxWidth: 'md',
      },
    },
    MuiStack: {
      defaultProps: {
        direction: 'row', // like native flex
      },
    },
  },
  palette: {
    primary: {
      main: colors.cyan[600],
      contrastText: 'white',
    },
  },
  spacing: (x: number) => `${x}rem`,
});

export default theme;
