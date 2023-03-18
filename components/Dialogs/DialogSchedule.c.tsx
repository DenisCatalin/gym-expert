import { ThemeProvider } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../interface/Button";
import { Dialog } from "../../interface/Dialog";
import { IconButton } from "../../interface/IconButton";
import { dialogInputTheme } from "../../utils/muiTheme";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import { setScheduleState } from "../../redux/schedule.slice";
import styles from "../../css/components/Dialogs.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { setSnackbar } from "../../redux/snackbar.slice";
import Input from "../../interface/Input";

type IDialogProps = {
  open: boolean;
  onClose: () => void;
  duplicate: boolean;
  exercises?: any;
};

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

const DialogSchedule = ({ open, onClose, duplicate, exercises }: IDialogProps) => {
  const [day, setDay] = useState<number | undefined>();
  const [name, setName] = useState<string>("");
  const [dayCheck, setDayCheck] = useState<boolean>(false);
  const [nameCheck, setNameCheck] = useState<boolean>(false);

  const dispatch = useDispatch();
  const scheduleRedux = useSelector((state: any) => state.schedule.schedule);
  const userRedux = useSelector((state: any) => state.user.user);

  function daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  const firestore = firebase.firestore();
  const progressRef = firestore.collection("schedule");
  const queryQ = progressRef.orderBy("day");
  //@ts-ignore
  const [schedule] = useCollectionData(queryQ, { id: "id" });

  const date = new Date();
  const month = months[date.getMonth()];

  useEffect(() => {
    if (day && day >= date.getDate() && day <= daysInMonth(date.getMonth(), date.getFullYear())) {
      setDayCheck(true);
    } else {
      setDayCheck(false);
    }
  }, [day]);

  useEffect(() => {
    if (name.length > 2) {
      setNameCheck(true);
    } else {
      setNameCheck(false);
    }
  }, [name]);

  const setCurrentDay = async () => {
    if (dayCheck) {
      const fullDate = `${day} ${month} ${date.getFullYear()}`;
      onClose();
      setDay(0);
      if (duplicate === true && schedule) {
        await progressRef.add({
          id: schedule.length + 1,
          day: day,
          month: month,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          exercises: exercises,
          sender: userRedux.issuer,
          name: name,
        });
        setName("");
        setDay(-1);
        dispatch(
          setScheduleState({
            ...scheduleRedux,
            scheduleMode: false,
            day: -1,
            month: "",
            name: "",
          })
        );
      }
      dispatch(
        setSnackbar({
          open: true,
          content:
            duplicate === true
              ? `You successfully duplicated your schedule for ${day} ${month}`
              : `Now you can select the exercises that you want to include in your schedule for ${day} ${month}`,
        })
      );
      setName("");
      setDay(-1);
      dispatch(
        setScheduleState({
          ...scheduleRedux,
          scheduleMode: duplicate ? false : true,
          day: day,
          month: month,
          name: name,
        })
      );
    }
  };

  return (
    <>
      <Dialog
        title={`Schedule for ${month}`}
        open={open}
        onClose={onClose}
        contentStyles={styles.background}
        textStyles={styles.text}
        contentOther={
          <>
            <div className={styles.dialogInput}>
              <ThemeProvider theme={dialogInputTheme}>
                <Input
                  label={"Day"}
                  color={dayCheck ? "secondary" : "error"}
                  type="text"
                  className={styles.textField}
                  value={day}
                  onChange={(e: any) => setDay(e.target.value)}
                />
                <Input
                  label={"Month"}
                  color={"secondary"}
                  type="text"
                  className={styles.textField}
                  value={`${month}`}
                />
                <Input
                  label={"Name"}
                  color={nameCheck ? "secondary" : "error"}
                  type="text"
                  className={styles.textField}
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
                <IconButton
                  className={styles.sft}
                  color={"inherit"}
                  label={
                    <>
                      <ScheduleSendIcon htmlColor="#fff" />
                    </>
                  }
                  onClick={setCurrentDay}
                  tooltip="Schedule for this day"
                  tooltipPlacement="top"
                />
              </ThemeProvider>
            </div>
          </>
        }
        actions={
          <>
            <Button
              ariaLabel="Close"
              color="secondary"
              role="button"
              label="Close"
              onClick={onClose}
            />
          </>
        }
      />
    </>
  );
};

export default DialogSchedule;
