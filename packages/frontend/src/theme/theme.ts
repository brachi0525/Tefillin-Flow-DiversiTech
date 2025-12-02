import { createTheme } from '@mui/material/styles';
import { heIL, enUS } from '@mui/material/locale';

export const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'YourFont, Arial, sans-serif',
  },

});



export const getTheme = (
  mode: 'light' | 'dark',
  direction: 'ltr' | 'rtl' = 'ltr',
  lang: 'he' | 'en' = 'he'
) =>
  createTheme(
    {
      direction,
      palette: {
        mode,
        primary: { main: '#1E3A8A' },
        secondary: { main: '#E3F2FD' },
        background: {
          default: mode === 'dark' ? '#181818' : '#fafafa',
          paper: mode === 'dark' ? '#232323' : '#F5F5F5',
        },
        text: {
          primary: mode === 'dark' ? '#fff' : '#000000',
          secondary: '#707070',
        },
      },
      typography: {
        fontFamily: lang === 'he' ? 'Heebo, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
      },
      spacing: 8,
      breakpoints: {
        values: { xs: 0, sm: 320, md: 768, lg: 1024, xl: 1440 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              fontWeight: 700,
            },
          },
        },

      },
    },
    lang === 'he' ? heIL : enUS
  );

export default getTheme;

