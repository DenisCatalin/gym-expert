import React, { useState } from "react";
import styles from "../../css/components/ProgressButton.module.css";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import { Dialog } from "../../interface/Dialog";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../interface/Table";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "../../lib/firebase";
import { useSelector } from "react-redux";
import { Button } from "../../interface/Button";
import { ThemeProvider } from "@mui/material";
import { inputTheme, tooltipTheme } from "../../utils/muiTheme";
import { MotionTypo } from "../../interface/MotionTypo";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/snackbar.slice";
import Input from "../../interface/Input";
import ProgressIconButton from "../../styles/ProgressButtonIcon.style";

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
        <ProgressIconButton
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
                <Input
                  label={"Your Weight"}
                  color={weightCheck ? "secondary" : "error"}
                  type="text"
                  className={styles.textField}
                  value={weight}
                  onChange={checkWeight}
                />
                <Input
                  label={"Muscle Gain"}
                  color={muscleCheck ? "secondary" : "error"}
                  type="text"
                  className={styles.textField}
                  value={muscle}
                  onChange={checkMuscle}
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
