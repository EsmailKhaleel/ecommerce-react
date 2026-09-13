import { alpha, createTheme } from '@mui/material/styles';

const BRAND = {
  orange: '#FF4F0F',
  orangeDark: '#B33600',
  peach: '#FFA673',
  teal: '#03A6A1',
  tealDark: '#01615E',
  cream: '#FFF6E5',
  ink: '#222222',
};

export const buildAdminTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: BRAND.orange,
        dark: BRAND.orangeDark,
        light: '#FF7F47',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: BRAND.teal,
        dark: BRAND.tealDark,
        light: '#4FD6D1',
        contrastText: '#FFFFFF',
      },
      success: { main: '#16877D' },
      warning: { main: '#D9841B' },
      info: { main: BRAND.teal },
      error: { main: '#C24136' },
      background:
        mode === 'dark'
          ? { default: '#11110F', paper: '#1B1916' }
          : { default: BRAND.cream, paper: '#FFFCF6' },
      text:
        mode === 'dark'
          ? { primary: BRAND.cream, secondary: '#CDBEAC' }
          : { primary: BRAND.ink, secondary: '#716354' },
      divider: mode === 'dark' ? alpha(BRAND.cream, 0.14) : alpha(BRAND.ink, 0.16),
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: 'inherit',
      h4: {
        fontFamily: '"Bodoni Moda", serif',
        fontWeight: 500,
        fontSize: '2rem',
        letterSpacing: '-0.035em',
      },
      h6: {
        fontFamily: '"Bodoni Moda", serif',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      subtitle2: { fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '::selection': { backgroundColor: BRAND.peach, color: BRAND.ink },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: mode === 'dark' ? 'none' : '0 14px 38px rgba(74, 48, 28, 0.055)',
          }),
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 700, borderRadius: 999 },
          containedPrimary: { '&:hover': { backgroundColor: BRAND.orangeDark } },
        },
      },
      MuiTextField: { defaultProps: { size: 'small' } },
      MuiSelect: { defaultProps: { size: 'small' } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.orange } },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            '--DataGrid-overlayHeight': '260px',
          }),
          columnHeaders: {
            backgroundColor: mode === 'dark' ? '#24201B' : '#FFE3BB',
            fontWeight: 700,
          },
          row: { '&:hover': { backgroundColor: alpha(BRAND.peach, 0.12) } },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: mode === 'dark' ? '#24201B' : '#FFE3BB',
            fontWeight: 700,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: { root: { backgroundColor: alpha(BRAND.peach, 0.2) } },
      },
    },
  });

export default buildAdminTheme;
