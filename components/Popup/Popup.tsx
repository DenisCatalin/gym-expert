import React, { useState } from "react";
import styles from "../../css/Pricing.module.css";
import { Dialog } from "../../interface/Dialog.tsx";
import { Button } from "../../interface/Button.tsx";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { ROUTES } from "../../Routes";
import { setUserState } from "../../redux/user.slice";

const Popup = () => {
  const [open, setOpen] = useState(true);
  const userRedux = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    dispatch(
      setUserState({
        ...userRedux,
        popup: true,
      })
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        title={`Hello, ${userRedux.email[0]}!`}
        contentStyles={styles.background}
        textStyles={styles.text}
        contentText="You haven't set your display name and secret keyword yet. Would you like to set it now?"
        actions={
          <>
            <Button color="secondary" onClick={handleClose} label="No" />
            <Button
              color="secondary"
              onClick={() => router.push(ROUTES.profile)}
              autoFocus={true}
              label="Yes"
            />
          </>
        }
      />
    </>
  );
};

export default Popup;
