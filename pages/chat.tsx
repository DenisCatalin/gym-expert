import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import styles from "../css/Chat.module.css";
import Head from "next/head";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";

const Chat = () => {
  const firestore = firebase.firestore();
  const dummy = useRef<any>(null);
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const userRedux = useSelector((state: any) => state.user.user);
  const { issuer, profilePic, displayName, cropArea, logged } = userRedux;
  //@ts-ignore
  const [messages] = useCollectionData(query, { id: "id" });

  const [formValue, setFormValue] = useState<string>("");

  const sendMessage = async (e: any) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sender: issuer,
      profilePic: profilePic,
      displayName: displayName,
      cropArea: cropArea,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Chat</title>
      </Head>
      <main className={styles.chatSpace}>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            {messages &&
              messages?.map((msg, idx) => (
                <ChatMessage
                  type="global"
                  key={idx}
                  date={msg?.createdAt?.seconds || null}
                  message={msg}
                />
              ))}

            <span ref={dummy}></span>
          </div>
          <motion.form
            onSubmit={sendMessage}
            className={styles.chatForm}
            animate={{ opacity: [0, 1], scale: [0.9, 1] }}
          >
            <motion.input
              value={formValue}
              onChange={e => setFormValue(e.target.value)}
              className={styles.chatInput}
              placeholder={
                displayName === null
                  ? "You haven't set your display name so you cannot send any messages"
                  : "Your message..."
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1] }}
              transition={{ delay: 0.5 }}
              disabled={!logged ? true : displayName === null ? true : false}
            />

            <motion.button
              type="submit"
              disabled={!formValue}
              className={styles.chatButton}
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
      </main>
    </div>
  );
};

export default Chat;
