import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "../../interface/IconButton";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { ThemeProvider } from "@mui/material";
import { tooltipTheme } from "../../utils/muiTheme";
import { Menu } from "../../interface/Menu";
import firebase from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styles2 from "../../css/components/PersonalMessages.module.css";
import { useSelector } from "react-redux";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import Image from "next/image";
import fetchData from "../../utils/fetchData";
import { Dialog } from "../../interface/Dialog";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import ChatMessage from "../ChatMessage/ChatMessage";
import { Button } from "../../interface/Button";
import DoNotDisturbOnRoundedIcon from "@mui/icons-material/DoNotDisturbOnRounded";
import DoDisturbOffRoundedIcon from "@mui/icons-material/DoDisturbOffRounded";

const PersonalMessages = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOptions, setMenuOptions] = useState<any[]>([]);
  const [dataProfile, setDataProfile] = useState<any[]>([]);
  const [toBeFetched, setToBeFetched] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentConversationID, setCurrentConversationID] = useState<number>(0);
  const [formValue, setFormValue] = useState<string>("");
  const [conversationDoc, setConversationDoc] = useState<any>("");
  const [conversationName, setConversationName] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [messageRead, setMessageRead] = useState<boolean>(false);
  const [countMessages, setCountMessages] = useState<number>(0);
  const [blockedConversation, setBlockedConversation] = useState<boolean>(false);
  const dummy = useRef<any>(null);

  const userRedux = useSelector((state: any) => state.user.user);

  const firestore = firebase.firestore();
  const conversationsRef = firestore.collection("conversations");
  const queryW = conversationsRef.orderBy("id");
  //@ts-ignore
  const [conversations] = useCollectionData(queryW, { id: "id" });

  let count = 0;

  useEffect(() => {
    setCountMessages(0);
    setToBeFetched([]);
    conversations?.map((conversation: any) => {
      const {
        id,
        participants,
        createdAt,
        conversationName,
        conversationPhoto,
        lastMessage,
        readBy,
        removedUsers,
        blockedBy,
      } = conversation;
      participants?.map((participant: any) => {
        if (id === currentConversationID && participants.includes(userRedux.issuer)) {
          if (
            (blockedBy.includes(participant) && participant !== userRedux.issuer) ||
            (blockedBy.includes(participant) && participant === userRedux.issuer)
          ) {
            setBlockedConversation(true);
          }
        }

        if (participants.includes(userRedux.issuer) && participant !== userRedux.issuer) {
          if (!toBeFetched.includes(participant)) {
            if (
              currentConversationID !== 0 &&
              !readBy?.includes(userRedux.issuer) &&
              conversation?.readBy
            ) {
              (async () => {
                const docRef = firestore.collection("conversations").doc(conversationDoc);
                const batch = firestore.batch();

                batch.update(docRef, {
                  readBy: [...conversation?.readBy, userRedux.issuer],
                });

                await batch.commit();
              })();
            }
            setToBeFetched(oldArray => [
              ...oldArray,
              {
                id: id,
                createdAt: createdAt,
                conversationName: conversationName,
                conversationPhoto: conversationPhoto,
                lastMessage: lastMessage,
                participant,
                readBy,
                removedUsers,
              },
            ]);
          }
        }
      });
    });
  }, [conversations, userRedux]);

  useEffect(() => {
    setDataProfile([]);
    if (toBeFetched.length > 0) {
      const promises = toBeFetched?.map(async (user: any) => {
        const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_PROFILE_DETAILS_BY_ISSUER}`, {
          method: "GET",
          headers: {
            body: JSON.stringify({
              issuer: user.participant,
            }),
          },
        });
        return {
          id: user.id,
          createdAt: user.createdAt,
          lastMessage: user.lastMessage,
          conversationName: user.conversationName,
          conversationPhoto: user.conversationPhoto,
          details: data?.profileDetails?.data?.users[0],
          readBy: user.readBy,
          removedUsers: user.removedUsers,
        };
      });

      Promise.all(promises).then(results => {
        setDataProfile(results);
      });
    }
  }, [toBeFetched]);

  useEffect(() => {
    setMenuOptions([]);
    if (dataProfile.length > 0) {
      dataProfile?.map((conversation: any, idx: number) => {
        const {
          id,
          details,
          conversationName,
          conversationPhoto,
          lastMessage,
          readBy,
          createdAt,
          removedUsers,
        } = conversation;

        if (!readBy?.includes(userRedux.issuer) && !removedUsers?.includes(userRedux.issuer)) {
          count++;
        }

        const date = new Date(createdAt?.seconds * 1000).toLocaleTimeString("en-US");
        if (!removedUsers?.includes(userRedux.issuer)) {
          setMenuOptions(oldArray => [
            ...oldArray,
            {
              key: id,
              label: (
                <div className={styles2.itemMessage}>
                  <h5 className={styles2.messageName}>
                    {conversationName === null ? details?.displayName : conversationName}
                  </h5>
                  <h5 className={styles2.messageDate}>{date}</h5>
                  {readBy?.includes(userRedux.issuer) ? null : (
                    <span className={styles2.messageRead}></span>
                  )}
                  {lastMessage !== "" ? (
                    <h5 className={styles2.itemText}>
                      {lastMessage.length > 40 ? (
                        <>{lastMessage.substring(0, 40)}... </>
                      ) : (
                        lastMessage
                      )}
                    </h5>
                  ) : null}
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
        }
      });
    }
    setCountMessages(count);
  }, [dataProfile]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async () => {
      if (conversationDoc && currentConversationID !== 0 && messageRead === true) {
        const docRef = firestore.collection("conversations").doc(conversationDoc);
        const batch = firestore.batch();

        conversations?.some((conversation: any) => {
          const { id, readBy } = conversation;
          if (
            id === currentConversationID &&
            conversation?.readBy &&
            !readBy.includes(userRedux.issuer)
          ) {
            batch.update(docRef, {
              readBy: [...conversation.readBy, userRedux.issuer],
            });
            setMessageRead(false);
            return true;
          }
          return false;
        });

        await batch.commit();
      }
    })();
  }, [messageRead]);

  const handleOpenDialog = async (idx: number) => {
    const doc = await getDocumentIdByFieldValue("id", dataProfile[idx].id);
    setConversationDoc(doc);
    setCurrentConversationID(dataProfile[idx].id);
    setConversationName(dataProfile[idx]?.details?.displayName);
    setOpenDialog(true);
    setMessageRead(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentConversationID(0);
    setMessageRead(false);
    setBlockedConversation(false);
  };

  const triggerDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const deleteConversation = async (e: any) => {
    e.preventDefault();
    const docRef = firestore.collection("conversations").doc(conversationDoc);

    const conversation = conversations?.find((conversation: any) => {
      const { id, participants } = conversation;
      return id === currentConversationID && participants.includes(userRedux.issuer);
    });

    // const party = conversation?.participants.filter(
    //   (participant: any) => participant !== userRedux.issuer
    // );

    docRef &&
      (await docRef.update({
        // participants: party,
        removedUsers: [...conversation?.removedUsers, userRedux.issuer],
      }));
    setOpenDialog(false);
    setOpenDeleteDialog(false);
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
                removedUsers: [],
                readBy: [userRedux.issuer],
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

  const blockConversation = async (e: any) => {
    e.preventDefault();
    const docRef = firestore.collection("conversations").doc(conversationDoc);

    const conversation = conversations?.find((conversation: any) => {
      const { id, participants } = conversation;
      return id === currentConversationID && participants.includes(userRedux.issuer);
    });

    docRef &&
      (await docRef.update({
        blockedBy: [...conversation?.blockedBy, userRedux.issuer],
      }));
  };

  const unblockConversation = async (e: any) => {
    e.preventDefault();
    const docRef = firestore.collection("conversations").doc(conversationDoc);
    setBlockedConversation(false);
    conversations?.map((conversation: any) => {
      const { id, blockedBy } = conversation;
      if (id === currentConversationID && blockedBy.includes(userRedux.issuer)) {
        (async () => {
          docRef &&
            (await docRef.update({
              blockedBy: [],
            }));
        })();
      }
    });
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
        {countMessages > 0 && <span className={styles2.countMessages}>{countMessages}</span>}
      </ThemeProvider>
      <Menu
        id="messages-menu"
        anchor={anchorEl}
        handleClose={handleClose}
        options={menuOptions}
        overflow="auto"
      />
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialog}
        title="Remove conversation"
        contentText="Are you sure you want to delete this conversation?"
        contentStyles={styles2.backgroundDelete}
        textStyles={styles2.text}
        actions={
          <>
            <Button color="secondary" role="button" label="No" onClick={closeDeleteDialog} />
            <Button color="secondary" role="button" label="Yes" onClick={deleteConversation} />
          </>
        }
      />
      <Dialog
        fullScreen={true}
        open={openDialog}
        onClose={handleCloseDialog}
        title={
          <div className={styles2.header}>
            <ThemeProvider theme={tooltipTheme}>
              <IconButton
                label={
                  <>
                    <ClearRoundedIcon htmlColor="#fff" />
                  </>
                }
                color="secondary"
                role="button"
                ariaLabel="Close conversation"
                tooltip="Close conversation"
                tooltipPlacement="bottom"
                className={styles2.button}
                onClick={handleCloseDialog}
              />
            </ThemeProvider>
            <h4 style={{ fontWeight: "bold", color: "var(--white)", fontFamily: "var(--font)" }}>
              {conversationName}
            </h4>
            <ThemeProvider theme={tooltipTheme}>
              <IconButton
                label={
                  <>
                    <KeyboardDoubleArrowDownRoundedIcon htmlColor="#fff" />
                  </>
                }
                color="secondary"
                role="button"
                ariaLabel="Scroll to the last message"
                tooltip="Scroll to bottom"
                tooltipPlacement="bottom"
                className={styles2.delete}
                onClick={scrollToBottom}
              />
              <IconButton
                label={
                  <>
                    <DeleteForeverRoundedIcon htmlColor="#fff" />
                  </>
                }
                color="secondary"
                role="button"
                ariaLabel="Delete the conversation"
                tooltip="Delete conversation"
                tooltipPlacement="bottom"
                className={styles2.button}
                onClick={triggerDeleteDialog}
              />
              {blockedConversation ? (
                <>
                  {conversations?.map((conversation: any, idx) => (
                    <React.Fragment key={idx}>
                      {conversation.id === currentConversationID &&
                      conversation.blockedBy.includes(userRedux.issuer) ? (
                        <>
                          <IconButton
                            label={
                              <>
                                <DoDisturbOffRoundedIcon htmlColor="#fff" />
                              </>
                            }
                            color="secondary"
                            role="button"
                            ariaLabel="Unblock user"
                            tooltip="Unblock user"
                            tooltipPlacement="bottom"
                            className={styles2.button}
                            onClick={unblockConversation}
                          />
                        </>
                      ) : null}
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <>
                  <IconButton
                    label={
                      <>
                        <DoNotDisturbOnRoundedIcon htmlColor="#fff" />
                      </>
                    }
                    color="secondary"
                    role="button"
                    ariaLabel="Block user"
                    tooltip="Block user"
                    tooltipPlacement="bottom"
                    className={styles2.button}
                    onClick={blockConversation}
                  />
                </>
              )}
            </ThemeProvider>
          </div>
        }
        contentStyles={styles2.background}
        contentOther={
          <div className={styles2.chat}>
            {conversations?.map((conversation: any, idx) => (
              <React.Fragment key={idx}>
                {conversation.id === currentConversationID ? (
                  <>
                    {conversation?.messages?.map((message: any, index: number) => (
                      <ChatMessage
                        type="personal"
                        date={conversation?.createdAt?.seconds}
                        message={message}
                        key={index}
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
                placeholder={
                  blockedConversation
                    ? "This conversation is blocked by one of the participants"
                    : "Your message..."
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1] }}
                transition={{ delay: 0.5 }}
                disabled={blockedConversation}
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
