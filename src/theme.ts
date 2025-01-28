import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#6B46C1',
      light: '#9F7AEA',
      dark: '#553C9A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#ED64A6',
      light: '#F687B3',
      dark: '#D53F8C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#1A1A2E',
      paper: '#2A2A3E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CBD5E0',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
        },
      },
    },
  },
}); 