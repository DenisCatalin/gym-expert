import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import styles from "../css/Chat.module.css";
import Head from "next/head";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";

firebase.initializeApp({
  apiKey: "AIzaSyDhSgEog6qqbLTE_WakNisgFLVLHG7wVqg",
  authDomain: "gym-expert-chat.firebaseapp.com",
  projectId: "gym-expert-chat",
  storageBucket: "gym-expert-chat.appspot.com",
  messagingSenderId: "791772438333",
  appId: "1:791772438333:web:9aedb139733266f3f0ef54",
  measurementId: "G-ZK5ZS8BCZV",
});

const Chat = () => {
  const firestore = firebase.firestore();
  const dummy = useRef<any>(null);
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const userRedux = useSelector((state: any) => state.user.user);
  const { issuer, profilePic, displayName } = userRedux;
  //@ts-ignore
  const [messages] = useCollectionData(query, { id: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e: any) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sender: issuer,
      profilePic: profilePic,
      displayName: displayName,
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
                <ChatMessage key={idx} date={msg?.createdAt?.seconds || null} message={msg} />
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
              placeholder="Your message..."
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1] }}
              transition={{ delay: 0.5 }}
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
