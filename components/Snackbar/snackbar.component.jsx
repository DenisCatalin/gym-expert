import { useContext, useState, forwardRef, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { snackbarContext } from "../../lib/snackbarContext";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = () => {
  const [open, setOpen] = useState(false);
  const { snackbarContent, setSnackbarContent } = useContext(snackbarContext);

  useEffect(() => {
    setOpen(false);
    if (snackbarContent !== "") setOpen(true);
  }, [snackbarContent]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setSnackbarContent("");
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        color="secondary"
        onClose={handleClose}
        severity="success"
        sx={{ width: "100%" }}
      >
        {snackbarContent}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
