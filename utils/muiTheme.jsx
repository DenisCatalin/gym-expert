import { createTheme } from "@mui/material/styles";

export const theme2 = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#434343",
      darker: "#434343",
    },
    neutral: {
      main: "#EEE",
      contrastText: "#EEE",
    },
    pink: {
      main: "#FBBEBE",
      contrastText: "#FBBEBE",
    },
    dark: {
      main: "#434343",
      contrastText: "#434343",
    },
  },
});

export const theme = createTheme({
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#FFF",
          fontSize: "1.2em",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          background: "rgba(220, 130, 242, .3)",
          fontSize: "1em",
        },
      },
    },
  },
});
