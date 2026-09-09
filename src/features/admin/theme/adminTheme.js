import { createTheme } from '@mui/material/styles';

// The storefront's primary/accent colours, so the admin area reads as part of
// the same product rather than a stock MUI template.
const BRAND = {
  primary: '#7C3AED',
  primaryDark: '#5B21B6',
  accent: '#0EA5E9',
};

export const buildAdminTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: BRAND.primary,
        dark: BRAND.primaryDark,
      },
      secondary: {
        main: BRAND.accent,
      },
      background:
        mode === 'dark'
          ? { default: '#0F172A', paper: '#1B2337' }
          : { default: '#F6F7FB', paper: '#FFFFFF' },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'inherit',
      h4: { fontWeight: 700, fontSize: '1.6rem' },
      h6: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
      MuiSelect: {
        defaultProps: { size: 'small' },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            '--DataGrid-overlayHeight': '260px',
          }),
          columnHeaders: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === 'dark' ? '#151C2E' : '#F1F3F9',
            fontWeight: 700,
          }),
        },
      },
    },
  });

export default buildAdminTheme;
