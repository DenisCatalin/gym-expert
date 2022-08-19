import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext } from "react";
import { dialogContext } from "../../lib/dialogContext";
import { purchaseContext } from "../../lib/purchaseContext";
import styles from "../../css/components/AlertDialog.module.css";
import StripeCheckoutButton from "../stripe-button/stripe-button.component";

const AlertDialog = () => {
  const { dialogAlert, setDialogAlert } = useContext(dialogContext);
  const { subscription, setSubscription } = useContext(purchaseContext);

  const handleClose = () => {
    setDialogAlert(false);
    setSubscription({
      price: 0,
      plan: "",
    });
  };

  return (
    <>
      <Dialog
        open={dialogAlert}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={styles.background}>
          {"We need you to be aware of the fact that..."}
        </DialogTitle>
        <DialogContent className={styles.background}>
          <DialogContentText
            id="alert-dialog-description"
            className={styles.text}
          >
            You are about to purchase a{" "}
            <span className={styles.emphasize}>
              {subscription.plan}ly subscription{" "}
            </span>{" "}
            on our platform for{" "}
            <span className={styles.emphasize}>${subscription.price}</span>. In
            order to go forward, we need your confirmation.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={styles.background}>
          <Button color="secondary" onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <StripeCheckoutButton
            price={subscription.price}
            period={subscription.plan}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertDialog;
