import { createTheme } from "@mui/material/styles";

export const inputTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          border: "1px solid white",
        },
      },
    },
  },
});

export const dialogInputTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          width: "80%",
          border: "2px solid #9c27b0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&:hover": {
            borderColor: "white",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: "var(--font)",
          fontSize: ".8em",
          background: "var(--heroButton)",
        },
      },
    },
  },
});

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

export const tooltipTheme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: "var(--font)",
          fontSize: ".8em",
          background: "var(--heroButton)",
        },
      },
    },
  },
});

export const tableTheme = createTheme({
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          background: "var(--progress)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "var(--white)",
          fontWeight: "bold",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
        selectLabel: {
          color: "var(--white)",
          fontWeight: "bold",
        },
        select: {
          color: "rgba(0, 0, 0, 0.5)",
          fontWeight: "bold",
        },

        displayedRows: {
          color: "var(--white)",
          fontWeight: "bold",
        },
      },
    },
    MuiNativeSelect: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiTableFooter: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
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

export const themePagination = createTheme({
  components: {
    MuiPagination: {
      styleOverrides: {
        root: {
          main: "#FFF",
          color: "white",
          background: "rgba(0, 0, 0, 0.5)",
          fontFamily: "var(--font)",
          zIndex: 5,
          padding: ".1rem",
          borderRadius: "20px",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          main: "#fff",
          color: "white",
          fontFamily: "var(--font)",
          border: "1px solid rgba(255, 255, 255, .5)",
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
