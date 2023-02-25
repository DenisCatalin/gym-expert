import React, { useState, useEffect, useRef } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton } from "../../interface/IconButton";
import { ThemeProvider } from "@mui/material";
import { dialogNotifications, tooltipTheme } from "../../utils/muiTheme";
import { Menu } from "../../interface/Menu";
import firebase from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styles from "../../css/components/Notifications.module.css";
import { useSelector, useDispatch } from "react-redux";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { Dialog } from "../../interface/Dialog";
import { Button } from "../../interface/Button";

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOptions, setMenuOptions] = useState<any[]>([]);
  const [countNotifications, setCountNotifications] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [titleDialog, setTitleDialog] = useState<string>("");
  const [contentDialog, setContentDialog] = useState<React.ReactNode>(<></>);
  const [actionsDialog, setActionsDialog] = useState<React.ReactNode>(<></>);
  const docIDref = useRef<number>(0);

  const userRedux = useSelector((state: any) => state.user.user);
  const { email } = userRedux;

  const firestore = firebase.firestore();
  const notificationsRef = firestore.collection("notifications");
  const queryQ = notificationsRef.orderBy("createdAt");
  //@ts-ignore
  const [notifications] = useCollectionData(queryQ, { id: "id" });

  let count: number = 0;

  const convertSecondsToDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleString();
  };

  useEffect(() => {
    setMenuOptions([]);
    setCountNotifications(0);
    notifications?.map((notification: any) => {
      const { id, forUser, title, type, read } = notification;
      if (forUser === email) {
        setMenuOptions(oldArray => [
          ...oldArray,
          {
            key: id,
            onClick: () => handleOpenDialog(id),
            label: (
              <div className={styles.notification}>
                <h5>{title}</h5>
                <h5>{convertSecondsToDate(notification.createdAt.seconds)}</h5>
              </div>
            ),
            icon: (
              <>
                {type === "warning" ? (
                  <WarningRoundedIcon htmlColor="var(--hotred)" />
                ) : type === "other" ? (
                  <NotificationsIcon htmlColor="var(--purple)" />
                ) : (
                  <PersonAddRoundedIcon htmlColor="var(--green)" />
                )}
              </>
            ),
            show: true,
          },
        ]);
      }
      if (forUser === email && read !== true) {
        count++;
      }
    });
    setCountNotifications(count);
  }, [notifications, userRedux]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  async function getDocumentIdByFieldValue(field: string, value: any) {
    try {
      const querySnapshot = await firestore
        .collection("notifications")
        .where(field, "==", value)
        .get();
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

  const handleOpenDialog = async (index: number) => {
    setOpenDialog(true);
    notifications?.map((notification: any) => {
      const { id, title, type, read, content, sender } = notification;
      if (id === index) {
        docIDref.current = id;
        setTitleDialog(title);
        setContentDialog(
          <div className={styles.contentDialog}>
            <div className={styles.contentHeader}>
              <p className={styles.date}>Sender: {sender}</p>
              <p className={styles.date}>
                Date: {convertSecondsToDate(notification.createdAt.seconds)}
              </p>
            </div>
            <p className={styles.content}>{content}</p>
          </div>
        );
        setActionsDialog(
          <>
            {type === "friends" ? (
              <>
                <Button onClick={closeDialog} label="Accept" color="secondary" />
                <Button onClick={closeDialog} label="Decline" color="secondary" />
              </>
            ) : (
              <Button onClick={closeDialog} label="Close" color="secondary" />
            )}
          </>
        );
      }
    });

    if (docIDref.current > 0) {
      const getID: any = await getDocumentIdByFieldValue("id", docIDref.current);
      const docRef = firestore.collection("notifications").doc(getID);
      {
        docRef &&
          (await docRef.update({
            read: true,
          }));
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <IconButton
          label={
            <>
              <NotificationsIcon htmlColor="var(--pink)" style={{ fontSize: "2em" }} />
            </>
          }
          tooltip="Notifications"
          tooltipPlacement="bottom"
          color="secondary"
          onClick={(event): any => handleClick(event)}
          onKeyDown={event => event.code === "Enter" && handleClick(event)}
        />
        {countNotifications > 0 && (
          <span className={styles.countNotifications}>{countNotifications}</span>
        )}
      </ThemeProvider>
      <Menu
        id="notifications-menu"
        anchor={anchorEl}
        handleClose={handleClose}
        options={menuOptions}
        overflow="auto"
        width="30%"
      />
      <ThemeProvider theme={dialogNotifications}>
        <Dialog
          fullWidth={true}
          maxWidth="sm"
          open={openDialog}
          onClose={closeDialog}
          title={titleDialog}
          contentOther={contentDialog}
          actions={actionsDialog}
        />
      </ThemeProvider>
    </>
  );
};

export default Notifications;
