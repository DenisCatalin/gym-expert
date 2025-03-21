import styles from "../../css/components/AlertDialog.module.css";
import StripeCheckoutButton from "../stripe-button/StripeButton.c";
import { useSelector, useDispatch } from "react-redux";
import { setSubscriptionState } from "../../redux/subscription.slice";
import { setDialog } from "../../redux/dialog.slice";
import { Button } from "../../interface/Button";
import { Dialog } from "../../interface/Dialog";
import { ThemeProvider } from "@mui/material";
import { alertDialog } from "../../utils/muiTheme";

type IAlertDialog = {
  dialogOpen?: boolean;
  title?: any;
  content?: any;
};

const AlertDialog = ({ title, content }: IAlertDialog) => {
  const subscription = useSelector((state: any) => state.subscription.subscription);
  const dialog = useSelector((state: any) => state.dialog.dialog);
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
      <ThemeProvider theme={alertDialog}>
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
      </ThemeProvider>
    </>
  );
};

export default AlertDialog;
