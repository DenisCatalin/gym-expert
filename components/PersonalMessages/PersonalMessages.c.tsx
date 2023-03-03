import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "../../interface/IconButton";
import { ThemeProvider } from "@mui/material";
import { tooltipTheme } from "../../utils/muiTheme";
import { Menu } from "../../interface/Menu";
import firebase from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styles from "../../css/components/Notifications.module.css";
import styles2 from "../../css/components/PersonalMessages.module.css";
import { useSelector } from "react-redux";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import Image from "next/image";
import fetchData from "../../utils/fetchData";
import { Dialog } from "../../interface/Dialog";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import ChatMessage from "../ChatMessage/ChatMessage";

const PersonalMessages = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOptions, setMenuOptions] = useState<any[]>([]);
  const [dataProfile, setDataProfile] = useState<any[]>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [toBeFetched, setToBeFetched] = useState<any[]>([]);
  const [fetched, setFetched] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentConversationID, setCurrentConversationID] = useState<number>(0);
  const [formValue, setFormValue] = useState<string>("");
  const [conversationDoc, setConversationDoc] = useState<any>("");
  const [conversationName, setConversationName] = useState<string>("");
  const dummy = useRef<any>(null);

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
      dataProfile?.map((conversation: any, idx: number) => {
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
            onClick: () => handleOpenDialog(idx),
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

  const handleOpenDialog = async (idx: number) => {
    const doc = await getDocumentIdByFieldValue("id", dataProfile[idx].id);
    setConversationDoc(doc);
    setCurrentConversationID(dataProfile[idx].id);
    setConversationName(dataProfile[idx]?.details?.displayName);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const docRef = firestore.collection("conversations").doc(conversationDoc);
    conversations?.map((conversation: any) => {
      const { id } = conversation;
      if (id === currentConversationID) {
        (async () => {
          {
            docRef &&
              (await docRef.update({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastMessage: formValue,
                messages: [
                  ...conversation?.messages,
                  {
                    sender: userRedux.issuer,
                    text: formValue,
                  },
                ],
              }));
          }
        })();
      }
    });

    setFormValue("");
  };

  async function getDocumentIdByFieldValue(field: string, value: any) {
    try {
      const querySnapshot = await conversationsRef.where(field, "==", value).get();
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

  const scrollToBottom = () => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
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
      <Dialog
        fullScreen={true}
        open={openDialog}
        onClose={handleCloseDialog}
        title={
          <>
            <button onClick={handleCloseDialog}>X</button>
            <p style={{ fontWeight: "bold", color: "var(--white)", fontFamily: "var(--font)" }}>
              {conversationName}
            </p>
            <button onClick={scrollToBottom}>sageata-n jos</button>
          </>
        }
        contentStyles={styles2.background}
        contentOther={
          <div className={styles2.chat}>
            {conversations?.map((conversation: any, idx) => (
              <React.Fragment key={idx}>
                {conversation.id === currentConversationID ? (
                  <>
                    {conversation?.messages?.map((message: any) => (
                      <ChatMessage
                        type="personal"
                        date={conversation?.createdAt?.seconds}
                        message={message}
                        key={idx}
                      />
                    ))}
                  </>
                ) : null}
              </React.Fragment>
            ))}
            <span ref={dummy}></span>
          </div>
        }
        actions={
          <div style={{ width: "100%" }}>
            <motion.form
              onSubmit={sendMessage}
              className={styles2.chatForm}
              animate={{ opacity: [0, 1], scale: [0.9, 1] }}
            >
              <motion.input
                value={formValue}
                onChange={e => setFormValue(e.target.value)}
                className={styles2.chatInput}
                placeholder={"Your message..."}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1] }}
                transition={{ delay: 0.5 }}
              />

              <motion.button
                type="submit"
                disabled={!formValue}
                className={styles2.chatButton}
                style={
                  formValue
                    ? { backgroundColor: "rgba(84, 197, 99, 1)" }
                    : { backgroundColor: "rgba(84, 197, 99, 0.664)" }
                }
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1] }}
                transition={{ delay: 1 }}
                aria-label="Send Message"
              >
                <SendIcon htmlColor={formValue ? "#fff" : "#ffffff4e"} />
              </motion.button>
            </motion.form>
          </div>
        }
      />
    </>
  );
};

export default PersonalMessages;
