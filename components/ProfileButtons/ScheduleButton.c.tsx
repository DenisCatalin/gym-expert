import React, { useEffect, useState } from "react";
import styles from "../../css/components/ScheduleButton.module.css";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { Dialog } from "../../interface/Dialog";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../../lib/firebase";
import { Button } from "../../interface/Button";
import { ThemeProvider } from "@mui/material";
import { tooltipTheme } from "../../utils/muiTheme";
import { MotionTypo } from "../../interface/MotionTypo";
import Image from "next/image";
import DialogSchedule from "../Dialogs/DialogSchedule.c";
import { setSnackbar } from "../../redux/snackbar.slice";
import moment from "moment";
import ScheduleButtonIcon from "../../styles/ScheduleButtonIcon.style";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ScheduleButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [rowID, setRowID] = React.useState<number>(-1);

  const userRedux = useSelector((state: any) => state.user.user);
  const { issuer } = userRedux;
  const dispatch = useDispatch();

  const firestore = firebase.firestore();
  const progressRef = firestore.collection("schedule");
  const queryQ = progressRef.orderBy("day", "asc").limit(25);
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

  const scheduleDialog = () => {
    setOpenScheduleDialog(true);
    handleOpenClose();
  };

  const closeScheduleDialog = () => {
    setOpenScheduleDialog(false);
  };

  const handleOpenClose = () => {
    setOpenDialog(false);
  };

  const setupDialog = (idx: number) => {
    setOpenDialog(true);
    setRowID(idx);
  };

  async function getDocumentIdByFieldValue(field: string, value: any) {
    try {
      const querySnapshot = await firestore.collection("schedule").where(field, "==", value).get();
      if (querySnapshot.empty) {
        console.log(`No documents found with ${field} equal to ${value}.`);
        return null;
      } else {
        const document = querySnapshot.docs[0];
        console.log(`Document data:`, document.data());
        return document.id;
      }
    } catch (error) {
      console.error(`Error getting document with ${field} equal to ${value}:`, error);
      return null;
    }
  }

  const deleteRow = async () => {
    const getID = array[rowID].id;
    const actualID: any = await getDocumentIdByFieldValue("id", getID);
    try {
      await firestore.collection("schedule").doc(actualID).delete();
      console.log(`Document with ID ${actualID} was successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting document with ID ${actualID}:`, error);
    }
    handleOpenClose();
    dispatch(
      setSnackbar({
        open: true,
        content: `You have successfully deleted your schedule for ${array[rowID]?.day} ${array[rowID]?.month}`,
      })
    );
  };

  const d = new Date();
  const currentDay = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  const getDayName = (day: number) => {
    const d = new Date();
    let date: any = moment(`${d.getMonth() + 1}-${day}-${year}`, "MM-DD-YYYY");
    let dayName: string = date.format("dddd").substring(0, 3);
    return dayName;
  };

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <ScheduleButtonIcon
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
        title={`Your schedule on ${month}`}
        textStyles={styles.text}
        contentStyles={styles.background}
        contentOther={
          <>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content={"Here you can view your scheduled exercises by day"}
            />
            <div className={styles.dates}>
              {array?.map((item: any, idx: number) => (
                <>
                  {item.month === month && (
                    <Button
                      label={
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <p>{item.day}</p>
                          <p>{getDayName(parseInt(item.day))}</p>
                        </div>
                      }
                      key={idx}
                      onClick={() => setupDialog(idx)}
                      color="inherit"
                      className={
                        currentDay === parseInt(item.day)
                          ? styles.dateContainerCurrent
                          : styles.dateContainer
                      }
                    />
                  )}
                </>
              ))}
            </div>
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
      <DialogSchedule
        open={openScheduleDialog}
        onClose={closeScheduleDialog}
        duplicate={true}
        exercises={array[rowID]?.exercises}
      />
      <Dialog
        fullWidth={true}
        maxWidth={array[rowID]?.exercises > 3 ? "lg" : "sm"}
        open={openDialog}
        onClose={handleOpenClose}
        title={`Your scheduled exercises for ${array[rowID]?.day} ${array[rowID]?.month} - ${array[rowID]?.name}`}
        textStyles={styles.text}
        contentStyles={styles.background}
        contentText={"Here is a preview for your exercises"}
        contentOther={
          <>
            <div className={styles.previewExercises}>
              {array[rowID]?.exercises?.map((exercise: string, idx: number) => (
                <div className={styles.fmm} key={idx}>
                  <Image
                    src={exercise}
                    alt="Preview"
                    key={idx}
                    layout="fill"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              ))}
            </div>
          </>
        }
        actions={
          <>
            <Button color="secondary" onClick={handleOpenClose} label={"Close"} />
            <Button color="secondary" onClick={scheduleDialog} autoFocus={true} label="Duplicate" />
            <Button color="secondary" onClick={deleteRow} autoFocus={true} label="Delete" />
          </>
        }
      />
    </>
  );
};

export default ScheduleButton;
