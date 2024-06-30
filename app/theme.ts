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
      main: colors.blue[400],
      contrastText: 'white',
    },
  },
  spacing: (x: number) => `${x}rem`,
});

export default theme;
