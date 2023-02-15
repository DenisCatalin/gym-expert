import React, { useState } from "react";
import styles from "../../css/components/ScheduleButton.module.css";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { IconButton } from "../../interface/IconButton";
import { Dialog } from "../../interface/Dialog";
import Table from "../../interface/Table";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import { Button } from "../../interface/Button";
import { ThemeProvider } from "@mui/material";
import { tooltipTheme } from "../../utils/muiTheme";
import { MotionTypo } from "../../interface/MotionTypo";

firebase.initializeApp({
  apiKey: "AIzaSyDhSgEog6qqbLTE_WakNisgFLVLHG7wVqg",
  authDomain: "gym-expert-chat.firebaseapp.com",
  projectId: "gym-expert-chat",
  storageBucket: "gym-expert-chat.appspot.com",
  messagingSenderId: "791772438333",
  appId: "1:791772438333:web:9aedb139733266f3f0ef54",
  measurementId: "G-ZK5ZS8BCZV",
});

const ScheduleButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  const userRedux = useSelector((state: any) => state.user.user);
  const { issuer } = userRedux;

  const firestore = firebase.firestore();
  const progressRef = firestore.collection("schedule");
  const queryQ = progressRef.orderBy("day", "desc").limit(25);
  //@ts-ignore
  const [messages] = useCollectionData(queryQ, { id: "id" });

  let array: any = [];

  messages?.map(message => {
    if (message.sender === issuer) {
      array.push(message);
    }
  });

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <IconButton
          color="secondary"
          label={
            <>
              <PendingActionsIcon htmlColor="#fff" />
            </>
          }
          role="button"
          ariaLabel="Schedule"
          className={styles.trackingButton}
          onClick={handleClick}
          tooltip="Schedule"
          tooltipPlacement="right"
        />
      </ThemeProvider>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        title="Your schedule"
        textStyles={styles.text}
        contentStyles={styles.background}
        contentOther={
          <>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content={"Here you can view your scheduled exercises by day"}
            />
            {array ? <Table rows={array} collection="schedule" typeOnClick="view" /> : null}
          </>
        }
        actions={
          <>
            <Button
              color="secondary"
              className={styles.bold}
              onClick={handleClose}
              autoFocus={true}
              label="Close"
            />
          </>
        }
      />
    </>
  );
};

export default ScheduleButton;
