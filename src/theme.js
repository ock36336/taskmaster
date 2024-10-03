// src/theme.js
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // สีหลัก
    },
    secondary: {
      main: '#dc004e', // สีรอง
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f4f6f8', // สีพื้นหลัง
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // ปรับขอบของปุ่มให้โค้งมน
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // เพิ่มเงาให้กับ Paper
        },
      },
    },
  },
});

export default theme;
