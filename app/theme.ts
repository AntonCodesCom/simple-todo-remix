import { colors, createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiContainer: {
      defaultProps: {
        fixed: true,
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
