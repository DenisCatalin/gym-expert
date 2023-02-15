import React, { useState } from "react";
import styles from "../../css/components/ProgressButton.module.css";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import { IconButton } from "../../interface/IconButton";
import { Dialog } from "../../interface/Dialog";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../interface/Table";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import { Button } from "../../interface/Button";
import { ThemeProvider } from "@mui/material";
import { inputTheme, tooltipTheme } from "../../utils/muiTheme";
import { MotionTypo } from "../../interface/MotionTypo";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/snackbar.slice";

firebase.initializeApp({
  apiKey: "AIzaSyDhSgEog6qqbLTE_WakNisgFLVLHG7wVqg",
  authDomain: "gym-expert-chat.firebaseapp.com",
  projectId: "gym-expert-chat",
  storageBucket: "gym-expert-chat.appspot.com",
  messagingSenderId: "791772438333",
  appId: "1:791772438333:web:9aedb139733266f3f0ef54",
  measurementId: "G-ZK5ZS8BCZV",
});

const ProgressButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [weight, setWeight] = useState<string>("");
  const [muscle, setMuscle] = useState<string>("");
  const [muscleCheck, setMuscleCheck] = useState<boolean>(true);
  const [weightCheck, setWeightCheck] = useState<boolean>(true);

  const userRedux = useSelector((state: any) => state.user.user);
  const { issuer } = userRedux;

  const dispatch = useDispatch();

  const firestore = firebase.firestore();
  const progressRef = firestore.collection("userProgress");
  const queryQ = progressRef.orderBy("createdAt");
  //@ts-ignore
  const [messages] = useCollectionData(queryQ, { id: "id" });

  let array: any = [];

  messages?.map(message => {
    if (message.sender === issuer) {
      array.push(message);
    }
  });

  const addProgress = async () => {
    if (!weight.match(/^[0-9]+$/) || !muscle.match(/^[0-9]+$/)) return;
    setWeight("");
    setMuscle("");
    setMuscleCheck(false);
    setWeightCheck(false);

    dispatch(
      setSnackbar({
        open: true,
        content: "Progress successfully added",
      })
    );

    {
      messages &&
        (await progressRef.add({
          id: messages.length + 1,
          weightLoss: parseInt(weight),
          muscleGain: parseInt(muscle),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          sender: issuer,
        }));
    }
  };

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const checkWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    if (!e.target.value.match(/^[0-9]+$/)) {
      setWeightCheck(false);
    } else {
      setWeightCheck(true);
    }
  };

  const checkMuscle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMuscle(e.target.value);
    if (!e.target.value.match(/^[0-9]+$/)) {
      setMuscleCheck(false);
    } else {
      setMuscleCheck(true);
    }
  };

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <IconButton
          color="secondary"
          label={
            <>
              <QueryStatsRoundedIcon htmlColor="#fff" />
            </>
          }
          role="button"
          ariaLabel="Track your progress"
          className={styles.trackingButton}
          onClick={handleClick}
          tooltip="Track your progress"
          tooltipPlacement="right"
        />
      </ThemeProvider>
      <Dialog
        fullWidth={true}
        // maxWidth={"lg"}
        open={open}
        onClose={handleClose}
        title="Track your progress"
        textStyles={styles.text}
        contentStyles={styles.background}
        contentOther={
          <>
            {array.length > 1 ? (
              <>
                <MotionTypo
                  className={styles.text}
                  animateOptions="opacityScale"
                  content={
                    <>
                      When you started to track your progress you had{" "}
                      <span style={{ fontWeight: "bold", color: "var(--pink)" }}>
                        {array[0]?.weightLoss}kg
                      </span>{" "}
                      and today you have{" "}
                      <span style={{ fontWeight: "bold", color: "var(--pink)" }}>
                        {array[array.length - 1]?.weightLoss}kg
                      </span>
                    </>
                  }
                />
              </>
            ) : (
              <h5 style={{ color: "var(--pink)" }}>Too little personal data</h5>
            )}
            <div className={styles.progressForm}>
              <ThemeProvider theme={inputTheme}>
                <TextField
                  label={"Your Weight"}
                  id={"weight"}
                  color={weightCheck ? "secondary" : "error"}
                  type="text"
                  className={styles.textField}
                  value={weight}
                  inputProps={{
                    style: {
                      color: "white",
                      borderRadius: "5px",
                    },
                  }}
                  onChange={checkWeight}
                  InputLabelProps={{ style: { color: "white" } }}
                />
                <TextField
                  label={"Muscle Gain"}
                  id={"muscle"}
                  color={muscleCheck ? "secondary" : "error"}
                  type="text"
                  className={styles.textField}
                  value={muscle}
                  onChange={checkMuscle}
                  inputProps={{
                    style: {
                      color: "white",
                      borderRadius: "5px",
                    },
                  }}
                  InputLabelProps={{ style: { color: "white" } }}
                />
              </ThemeProvider>
              <Button
                color="inherit"
                className={styles.buttonAdd}
                onClick={addProgress}
                label={
                  <>
                    <AddIcon htmlColor="#fff" />
                    Add Progress
                  </>
                }
              />
            </div>
            {array ? <Table rows={array} collection="userProgress" typeOnClick="delete" /> : null}
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

export default ProgressButton;
