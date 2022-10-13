import { forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/snackbar.slice";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = () => {
  const snackbar = useSelector((state) => state.snackbar.snackbar);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(
      setSnackbar({
        open: false,
        content: "",
      })
    );
  };
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert color="secondary" onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        {snackbar.content}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
