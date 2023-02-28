import React, { useState, useEffect, useRef } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton } from "../../interface/IconButton";
import { ThemeProvider } from "@mui/material";
import { dialogNotifications, tooltipTheme } from "../../utils/muiTheme";
import { Menu } from "../../interface/Menu";
import firebase from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styles from "../../css/components/Notifications.module.css";
import { useSelector } from "react-redux";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { Dialog } from "../../interface/Dialog";
import { Button } from "../../interface/Button";
import fetchData from "../../utils/fetchData";

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOptions, setMenuOptions] = useState<any[]>([]);
  const [countNotifications, setCountNotifications] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [titleDialog, setTitleDialog] = useState<string>("");
  const [contentDialog, setContentDialog] = useState<React.ReactNode>(<></>);
  const [actionsDialog, setActionsDialog] = useState<React.ReactNode>(<></>);
  const docIDref = useRef<number>(0);
  const userIssuer = useRef<string>("");

  const userRedux = useSelector((state: any) => state.user.user);

  const firestore = firebase.firestore();
  const notificationsRef = firestore.collection("notifications");
  const friendsRef = firestore.collection("friends");
  const queryQ = notificationsRef.orderBy("createdAt", "desc");
  const queryW = friendsRef.orderBy("id");
  //@ts-ignore
  const [notifications] = useCollectionData(queryQ, { id: "id" });
  //@ts-ignore
  const [friends] = useCollectionData(queryW, { id: "id" });

  let count: number = 0;

  const convertSecondsToDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleString();
  };

  useEffect(() => {
    setMenuOptions([]);
    setCountNotifications(0);
    notifications?.map((notification: any) => {
      const { id, forUser, title, type, read } = notification;
      if (forUser === userRedux.issuer) {
        setMenuOptions(oldArray => [
          ...oldArray,
          {
            key: id,
            onClick: () => handleOpenDialog(id),
            label: (
              <div className={styles.notification}>
                <h5 className={read ? styles.contentRead : styles.contentBold}>{title}</h5>
                <h5 className={read ? styles.contentRead : styles.contentBold}>
                  {convertSecondsToDate(notification?.createdAt?.seconds)}
                </h5>
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
      if (forUser === userRedux.issuer && read !== true) {
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

  const addUserAsFriend = async (issuer: string) => {
    const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_PROFILE_DETAILS_BY_ISSUER}`, {
      method: "GET",
      headers: {
        body: JSON.stringify({
          issuer: issuer,
        }),
      },
    });
    {
      friends &&
        (await friendsRef.add({
          id: friends.length + 1,
          issuer: userRedux.issuer,
          friendIssuer: userIssuer.current,
          friendName: data?.profileDetails?.data?.users[0].displayName,
          friendPhoto: data?.profileDetails?.data?.users[0].profilePic,
        }));
    }
    {
      friends &&
        (await friendsRef.add({
          id: friends.length + 2,
          issuer: userIssuer.current,
          friendIssuer: userRedux.issuer,
          friendName: userRedux.displayName,
          friendPhoto: userRedux.profilePic,
        }));
    }
  };

  const acceptRequest = async () => {
    closeDialog();
    {
      notifications &&
        (await notificationsRef.add({
          id: notifications.length + 1,
          content: `${userRedux.displayName} accepted your friend request. You may now ... to be continued`,
          forUser: userIssuer.current,
          read: false,
          sender: userRedux.displayName,
          senderIssuer: userRedux.issuer,
          title: `${userRedux.displayName} accepted your friend request.`,
          type: "friends",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          responded: true,
        }));
    }
    await addUserAsFriend(userIssuer.current);
    if (docIDref.current > 0) {
      const getID: any = await getDocumentIdByFieldValue("id", docIDref.current);
      const docRef = firestore.collection("notifications").doc(getID);
      {
        docRef &&
          (await docRef.update({
            responded: true,
          }));
      }
    }
  };

  const declineRequest = async () => {
    closeDialog();
    {
      notifications &&
        (await notificationsRef.add({
          id: notifications.length + 1,
          content: `${userRedux.displayName} declined your friend request`,
          forUser: userIssuer.current,
          read: false,
          sender: userRedux.displayName,
          senderIssuer: userRedux.issuer,
          title: `${userRedux.displayName} has declined your friend request. Unfortunately, you cannot make everyone your friend :(`,
          type: "friends",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          responded: true,
        }));
    }
    if (docIDref.current > 0) {
      const getID: any = await getDocumentIdByFieldValue("id", docIDref.current);
      const docRef = firestore.collection("notifications").doc(getID);
      {
        docRef &&
          (await docRef.update({
            responded: true,
          }));
      }
    }
  };

  const handleOpenDialog = async (index: number) => {
    setOpenDialog(true);
    notifications?.map((notification: any) => {
      const { id, title, type, content, sender, senderIssuer, responded } = notification;
      if (id === index) {
        docIDref.current = id;
        userIssuer.current = senderIssuer;
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
                {responded === false ? (
                  <>
                    <Button onClick={acceptRequest} label="Accept" color="secondary" />
                    <Button onClick={declineRequest} label="Decline" color="secondary" />
                  </>
                ) : (
                  <>
                    <Button onClick={deleteNotification} label="Delete" color="secondary" />
                    <Button onClick={closeDialog} label="Close" color="secondary" />
                  </>
                )}
              </>
            ) : (
              <>
                <Button onClick={deleteNotification} label="Delete" color="secondary" />
                <Button onClick={closeDialog} label="Close" color="secondary" />
              </>
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

  const deleteNotification = async () => {
    const getID: any = await getDocumentIdByFieldValue("id", docIDref.current);
    await firestore.collection("notifications").doc(getID).delete();
    closeDialog();
    console.log("hey", getID, docIDref.current);
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
