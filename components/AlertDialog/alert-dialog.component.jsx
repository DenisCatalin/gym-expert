import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "../../css/components/AlertDialog.module.css";
import StripeCheckoutButton from "../stripe-button/stripe-button.component";
import { useSelector, useDispatch } from "react-redux";
import { setSubscriptionState } from "../../redux/subscription.slice";
import { setDialog } from "../../redux/dialog.slice";

const AlertDialog = ({ title, content }) => {
  const subscription = useSelector(state => state.subscription.subscription);
  const dialog = useSelector(state => state.dialog.dialog);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setDialog(false));
    dispatch(
      setSubscriptionState({
        price: 0,
        plan: "",
      })
    );
  };

  return (
    <>
      <Dialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={styles.background}>
          {title}
        </DialogTitle>
        <DialogContent className={styles.background}>
          <DialogContentText id="alert-dialog-description" className={styles.text}>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={styles.background}>
          <Button color="secondary" onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <StripeCheckoutButton price={subscription.price} period={subscription.plan} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertDialog;
