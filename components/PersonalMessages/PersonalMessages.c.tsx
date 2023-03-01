import React, { useState, useEffect } from "react";
import { IconButton } from "../../interface/IconButton";
import { ThemeProvider } from "@mui/material";
import { tooltipTheme } from "../../utils/muiTheme";
import { Menu } from "../../interface/Menu";
import firebase from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styles from "../../css/components/Notifications.module.css";
import { useSelector } from "react-redux";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import Image from "next/image";
import fetchData from "../../utils/fetchData";

const PersonalMessages = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOptions, setMenuOptions] = useState<any[]>([]);
  const [dataProfile, setDataProfile] = useState<any[]>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [toBeFetched, setToBeFetched] = useState<any[]>([]);
  const [fetched, setFetched] = useState<boolean>(false);

  const userRedux = useSelector((state: any) => state.user.user);

  const firestore = firebase.firestore();
  const conversationsRef = firestore.collection("conversations");
  const queryW = conversationsRef.orderBy("id");
  //@ts-ignore
  const [conversations] = useCollectionData(queryW, { id: "id" });

  useEffect(() => {
    let count = 0;
    setDataFetched(false);
    setFetched(false);
    setToBeFetched([]);
    conversations?.map((conversation: any) => {
      const { id, participants, createdAt, conversationName, conversationPhoto } = conversation;
      participants?.map((participant: any) => {
        if (participants.includes(userRedux.issuer) && participant !== userRedux.issuer) {
          if (!toBeFetched.includes(participant)) {
            setToBeFetched(oldArray => [
              ...oldArray,
              {
                id: id,
                createdAt: createdAt,
                conversationName: conversationName,
                conversationPhoto: conversationPhoto,
                participant,
              },
            ]);
            count++;
            if (count === toBeFetched.length) {
              setFetched(true);
            }
          }
        }
      });
    });
  }, [conversations, userRedux]);

  useEffect(() => {
    let count = 0;
    console.log("to be fetched", toBeFetched);
    setDataProfile([]);
    toBeFetched?.map((user: any) => {
      (async () => {
        const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_PROFILE_DETAILS_BY_ISSUER}`, {
          method: "GET",
          headers: {
            body: JSON.stringify({
              issuer: user.participant,
            }),
          },
        });
        setDataProfile(oldArray => [
          ...oldArray,
          {
            id: user.id,
            createdAt: user.createdAt,
            conversationName: user.conversationName,
            conversationPhoto: user.conversationPhoto,
            details: data?.profileDetails?.data?.users[0],
          },
        ]);
        count++;
        if (count === toBeFetched.length) {
          setDataFetched(true);
        }
      })();
    });
  }, [fetched]);

  useEffect(() => {
    setMenuOptions([]);
    if (dataFetched === true) {
      dataProfile?.map((conversation: any) => {
        const { id, details, conversationName, conversationPhoto } = conversation;

        setMenuOptions(oldArray => [
          ...oldArray,
          {
            key: id,
            label: (
              <div className={styles.notification} style={{ marginLeft: "1em" }}>
                <h5>{conversationName === null ? details.displayName : conversationName}</h5>
              </div>
            ),
            icon: (
              <>
                <Image
                  src={conversationPhoto === null ? details.profilePic : conversationPhoto}
                  alt=""
                  width={50}
                  height={50}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </>
            ),
            onClick: () => console.log("you clicked"),
            show: true,
          },
        ]);
      });
    }
  }, [conversations, userRedux, dataFetched]);

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
              <EmailRoundedIcon htmlColor="var(--pink)" style={{ fontSize: "2em" }} />
            </>
          }
          tooltip="Messages"
          tooltipPlacement="bottom"
          color="secondary"
          onClick={(event): any => handleClick(event)}
          onKeyDown={event => event.code === "Enter" && handleClick(event)}
        />
      </ThemeProvider>
      <Menu
        id="messages-menu"
        anchor={anchorEl}
        handleClose={handleClose}
        options={menuOptions}
        overflow="auto"
      />
    </>
  );
};

export default PersonalMessages;

/* 
conversations {
    id: number,
    participants: [],
    messages: [
        {
    orderBy createdAt: timestamp,
            sender: issuer,
            text: string,
            read: boolean,
        }
    ],
    lastMessage: lastInput,
    createdAt: timestamp,
    conversationPhoto: get it from the frontend if participants.length === 2 to each other user profile pic else users should choose one. Default will be a circle
}
*/
