import styles from "../../css/components/AlertDialog.module.css";
import StripeCheckoutButton from "../stripe-button/stripe-button.component";
import { useSelector, useDispatch } from "react-redux";
import { setSubscriptionState } from "../../redux/subscription.slice";
import { setDialog } from "../../redux/dialog.slice";
import { Button } from "../../interface/Button";
import { Dialog } from "../../interface/Dialog";

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
        title={title}
        contentStyles={styles.background}
        textStyles={styles.text}
        contentText={content}
        actions={
          <>
            <Button color={"secondary"} onClick={handleClose} autoFocus={true} label={"Cancel"} />
            <StripeCheckoutButton price={subscription.price} period={subscription.plan} />
          </>
        }
      />
    </>
  );
};

export default AlertDialog;
