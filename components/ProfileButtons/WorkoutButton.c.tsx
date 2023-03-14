import React, { useState } from "react";
import styles from "../../css/components/WorkoutButton.module.css";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Dialog } from "../../interface/Dialog";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../interface/Table";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { Button } from "../../interface/Button";
import { ThemeProvider } from "@mui/material";
import { inputTheme, tooltipTheme } from "../../utils/muiTheme";
import { MotionTypo } from "../../interface/MotionTypo";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/snackbar.slice";
import Input from "../../interface/Input";
import firebase from "../../lib/firebase";
import WorkoutButtonIcon from "../../styles/WorkoutButtonIcon.style";

const WorkoutButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [weight, setWeight] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [sets, setSets] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameCheck, setNameCheck] = useState<boolean>(true);
  const [repsCheck, setRepsCheck] = useState<boolean>(true);
  const [setsCheck, setSetsCheck] = useState<boolean>(true);
  const [weightCheck, setWeightCheck] = useState<boolean>(true);

  const userRedux = useSelector((state: any) => state.user.user);
  const { issuer } = userRedux;

  const dispatch = useDispatch();

  const firestore = firebase.firestore();
  const progressRef = firestore.collection("workout");
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
    if (
      !weight.match(/^[0-9]+$/) ||
      !sets.match(/^[0-9]+$/) ||
      !reps.match(/^[0-9]+$/) ||
      name.length === 0
    )
      return;
    setWeight("");
    setReps("");
    setSets("");
    setName("");
    setNameCheck(false);
    setWeightCheck(false);
    setRepsCheck(false);
    setSetsCheck(false);

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
          weight: parseInt(weight),
          sets: parseInt(sets),
          reps: parseInt(reps),
          name: name,
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

  const checkSets = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSets(e.target.value);
    if (!e.target.value.match(/^[0-9]+$/)) {
      setSetsCheck(false);
    } else {
      setSetsCheck(true);
    }
  };

  const checkReps = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReps(e.target.value);
    if (!e.target.value.match(/^[0-9]+$/)) {
      setRepsCheck(false);
    } else {
      setRepsCheck(true);
    }
  };

  const checkName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.length < 3) {
      setNameCheck(false);
    } else {
      setNameCheck(true);
    }
  };

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <WorkoutButtonIcon
          color="secondary"
          label={
            <>
              <FitnessCenterIcon htmlColor="#fff" />
            </>
          }
          role="button"
          ariaLabel="Workout tracking"
          className={styles.trackingButton}
          onClick={handleClick}
          tooltip="Track your workout"
          tooltipPlacement="left"
        />
      </ThemeProvider>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
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
                        {array[0]?.weight}kg
                      </span>{" "}
                      and today you have{" "}
                      <span style={{ fontWeight: "bold", color: "var(--pink)" }}>
                        {array[array.length - 1]?.weight}kg
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
                <div className={styles.inputs}>
                  <Input
                    label={"Name of exercise"}
                    color={nameCheck ? "secondary" : "error"}
                    type="text"
                    className={styles.textField}
                    value={name}
                    onChange={checkName}
                  />
                  <Input
                    label={"Sets"}
                    color={setsCheck ? "secondary" : "error"}
                    type="text"
                    className={styles.textField}
                    value={sets}
                    onChange={checkSets}
                  />
                  <Input
                    label={"Reps"}
                    color={repsCheck ? "secondary" : "error"}
                    type="text"
                    className={styles.textField}
                    value={reps}
                    onChange={checkReps}
                  />
                  <Input
                    label={"Weight"}
                    color={weightCheck ? "secondary" : "error"}
                    type="text"
                    className={styles.textField}
                    value={weight}
                    onChange={checkWeight}
                  />
                </div>
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
            {array ? <Table rows={array} collection="workout" typeOnClick="delete" /> : null}
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

export default WorkoutButton;
