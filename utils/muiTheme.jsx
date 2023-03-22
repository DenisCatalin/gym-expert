import { TextField } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";

export const ValidationTextField = styled(TextField)({
  // asta merge
  "& .MuiOutlinedInput-root": {
    color: "white",
    "&:hover fieldset": {
      borderColor: "var(--purple)",
    },
  },
});

export const inputTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      root: {
        "&:hover fieldset": {
          borderColor: "green",
        },
      },
      styleOverrides: {
        notchedOutline: {
          border: "1px solid white",
        },
      },
    },
  },
});

export const avatarTheme = createTheme({
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: "60px",
          height: "60px",
          "@media screen and (max-width: 1200px)": {
            width: "50px",
            height: "50px",
          },
          "@media only screen and (orientation : portrait) and (-webkit-min-device-pixel-ratio: 1) and (min-device-width : 390px) and (max-device-width : 540px)":
            {
              width: "70px",
              height: "70px",
            },
          "@media only screen and (orientation : portrait) and (-webkit-min-device-pixel-ratio: 1) and (min-device-width : 360px) and (max-device-width : 389px)":
            {
              width: "60px",
              height: "60px",
            },
        },
      },
    },
  },
});

export const dateContainer = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          width: "100px",
          height: "100px",
          background: "var(--pink)",
          margin: "1em",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontSize: "1.2em",
          boxShadow: "0 0 5px var(--pink)",
          display: "flex",
          fontFamily: "var(--font)",
          "&:hover": {
            background: "var(--pink)",
            boxShadow: "0 0 20px var(--pink)",
          },
        },
      },
    },
  },
});

export const dateContainerCurrent = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          width: "100px",
          height: "100px",
          background: "var(--purple)",
          margin: "1em",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontSize: "1.2em",
          boxShadow: "0 0 5px var(--purple)",
          display: "flex",
          fontFamily: "var(--font)",
          "&:hover": {
            background: "var(--purple)",
            boxShadow: "0 0 20px var(--purple)",
          },
        },
      },
    },
  },
});

export const alertDialog = createTheme({
  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font)",
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font)",
          color: "var(--white)",
        },
      },
    },
  },
});

export const autocompleteTheme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          position: "absolute",
          width: "12%",
          top: "3%",
          left: "1%",
          fontFamily: "var(--font)",
          "@media screen and (max-width: 1680px)": {
            width: "15%",
          },
          "@media screen and (max-width: 1380px)": {
            width: "20%",
          },
          "@media screen and (max-width: 480px)": {
            width: "80%",
            position: "initial",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            border: "2px solid var(--progress)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "2px solid var(--progress)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "2px solid var(--progress)",
          },
        },
      },
    },
  },
});

export const dialogNotifications = createTheme({
  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font)",
          color: "rgba(255, 255, 255, 0.5)",
          background: "var(--background)",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font)",
          color: "var(--white)",
          background: "var(--background)",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          background: "var(--background)",
        },
      },
    },
  },
});

export const dialogInputTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover fieldset": {
            borderColor: "green",
          },
        },
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

export const scheduleButton = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          width: "8%",
          height: "5%",
          borderRadius: "10px",
          fontSize: ".8em",
          fontFamily: "var(--font)",
          fontWeight: "bold",
          color: "var(--white)",
          background: "var(--avatarGradient)",
          cursor: "pointer",
          border: "none",
          outline: "none",
          transition: "all 0.2s ease-in-out",
          position: "absolute",
          zIndex: "5",
        },
      },
    },
  },
});

export const buttonTheme = createTheme({
  status: {
    danger: "#e53e3e",
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
    MuiButton: {
      styleOverrides: {
        root: {
          width: "7%",
          height: "50%",
          borderRadius: "10px",
          fontSize: ".8em",
          fontFamily: "var(--font)",
          fontWeight: "bold",
          color: "var(--white)",
          background: "var(--avatarGradient)",
          cursor: "pointer",
          border: "none",
          outline: "none",
          transition: "all 0.2s ease-in-out",
        },
      },
    },
  },
});

export const exerciseButtonTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          width: "55%",
          height: "20%",
          borderRadius: "50px",
          fontSize: ".9em",
          fontFamily: "var(--font)",
          fontWeight: "bold",
          color: "var(--white)",
          background: "var(--pink)",
          cursor: "pointer",
          border: "none",
          outline: "none",
          transition: "all 0.2s ease-in-out",
          "&:last-child": {
            position: "absolute",
          },
          "&:hover": {
            color: "var(--white)",
            background: "var(--pink)",
          },
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
