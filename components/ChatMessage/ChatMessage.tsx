import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../css/components/ChatMessage.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { doc, getDocs, deleteDoc, query, collection } from "firebase/firestore";

type IChatMessage = {
  message?: any;
  date: number;
  id?: any;
};

const ChatMessage = ({ message, date }: IChatMessage) => {
  const { text, sender, profilePic, displayName } = message;
  const output = new Date(Math.floor(date * 1000));
  const startingDate = output.toString().split("GMT");
  const userRedux = useSelector((state: any) => state.user.user);
  const [data, setData] = useState<any>();

  const firestore = firebase.firestore();

  useEffect(() => {
    (async () => {
      const db = query(collection(firestore, "messages"));
      const res = await getDocs(db);
      const data = res.docs.map(doc => ({
        id: doc.id,
      }));
      setData(data);
    })();
  }, []);

  return (
    <>
      {userRedux.issuer === sender ? (
        <motion.div className={styles.sender} animate={{ opacity: [0, 1], scale: [0.9, 1] }}>
          <div className={styles.senderMessage}>
            <h1 className={styles.profileName}>{displayName}</h1>
            <h1 className={styles.chatMessage}>{text}</h1>
            <span className={styles.tooltipS}>{startingDate[0]}</span>
          </div>
          <div className={styles.chatProfilePic}>
            <div className={styles.chatProfileImg} style={{ marginLeft: ".3rem" }}>
              <Image
                src={userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic}
                alt=""
                layout="fill"
                objectFit="cover"
                priority
                blurDataURL={
                  userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic
                }
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div className={styles.receiver} animate={{ opacity: [0, 1], scale: [0.9, 1] }}>
          <div className={styles.chatProfilePic}>
            <div className={styles.chatProfileImg} style={{ marginRight: ".3rem" }}>
              <Image src={profilePic} alt="" priority blurDataURL={profilePic} layout="fill" />
            </div>
          </div>
          <div className={styles.receiverMessage}>
            <h1 className={styles.profileName}>{displayName}</h1>
            <h1 className={styles.chatMessage}>{text}</h1>
            <span className={styles.tooltip}>{startingDate[0]}</span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ChatMessage;
