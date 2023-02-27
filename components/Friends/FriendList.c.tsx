import React, { useState, useEffect } from "react";
import { IconButton } from "../../interface/IconButton";
import { ThemeProvider } from "@mui/material";
import { tooltipTheme } from "../../utils/muiTheme";
import { Menu } from "../../interface/Menu";
import firebase from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styles from "../../css/components/Notifications.module.css";
import { useSelector } from "react-redux";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import Image from "next/image";
import { useRouter } from "next/router";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

const FriendList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOptions, setMenuOptions] = useState<any[]>([]);
  const userRedux = useSelector((state: any) => state.user.user);

  const firestore = firebase.firestore();
  const friendsRef = firestore.collection("friends");
  const queryW = friendsRef.orderBy("id");
  //@ts-ignore
  const [friends] = useCollectionData(queryW, { id: "id" });

  const router = useRouter();

  useEffect(() => {
    setMenuOptions([]);
    friends?.map((friend: any) => {
      const { id, issuer, friendName, friendPhoto } = friend;
      if (issuer === userRedux.issuer) {
        setMenuOptions(oldArray => [
          ...oldArray,
          {
            key: id,
            label: (
              <div className={styles.notification} style={{ marginLeft: "1em" }}>
                <h5>{friendName}</h5>
              </div>
            ),
            icon: (
              <>
                <Image
                  src={friendPhoto}
                  alt=""
                  width={50}
                  height={50}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </>
            ),
            onClick: () => router.push(`/profile/${friendName}`),
            show: true,
          },
        ]);
      }
    });
  }, [friends, userRedux]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <IconButton
          label={
            <>
              <GroupsRoundedIcon htmlColor="var(--pink)" style={{ fontSize: "2em" }} />
            </>
          }
          tooltip="Friend List"
          tooltipPlacement="bottom"
          color="secondary"
          onClick={(event): any => handleClick(event)}
          onKeyDown={event => event.code === "Enter" && handleClick(event)}
        />
      </ThemeProvider>
      <Menu
        id="friends-menu"
        anchor={anchorEl}
        handleClose={handleClose}
        options={menuOptions}
        overflow="auto"
      />
    </>
  );
};

export default FriendList;
