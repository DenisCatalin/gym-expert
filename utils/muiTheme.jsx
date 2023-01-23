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
      main: "#fff",
      contrastText: "#fff",
    },
  },
});

export const buttonTheme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#FFF",
      width: "7%",
      height: "50%",
      borderRadius: "50%",
      background: "var(--avatarGradient)",
      fontFamily: "var(--font)",
      // border-radius: 10px;
      // font-size: .8em;
      // font-family: var(--font);
      // font-weight: bold;
      // color: var(--white);
      // cursor: pointer;
      // border: none;
      // outline: none;
      // transition: all 0.2s ease-in-out;
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          main: "#FFF",
          width: "7%",
          height: "50%",
          background: "var(--avatarGradient)",
          borderRadius: "50%",
          fontFamily: "var(--font)",
        },
      },
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
        palette: {
          primary: {
            color: "#fff",
          },
        },
        root: {
          color: "#FFF",
          fontSize: "1em",
        },
      },
    },
  },
});

export const selectTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          main: "#FFF",
          color: "white",
          background: "var(--avatarGradient)",
          fontFamily: "var(--font)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          main: "#fff",
          color: "white",
          fontFamily: "var(--font)",
        },
      },
    },
  },
});
