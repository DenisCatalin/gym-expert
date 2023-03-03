import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../css/components/ChatMessage.module.css";
import styles2 from "../../css/components/PersonalMessages.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getDocs, query, collection } from "firebase/firestore";
import { cropImages } from "../../lib/cropImages";
import fetchData from "../../utils/fetchData";

type IChatMessage = {
  message?: any;
  date: number;
  id?: any;
  type: string;
};

const ChatMessage = ({ message, date, type }: IChatMessage) => {
  const { text, sender, profilePic, displayName, cropArea } = message;
  const output = new Date(Math.floor(date * 1000));
  const startingDate = output.toString().split("GMT");
  const userRedux = useSelector((state: any) => state.user.user);
  const [data, setData] = useState<any>();
  const [img, setImg] = useState<any>();
  const [senderName, setSenderName] = useState<any>();

  const firestore = firebase.firestore();

  useEffect(() => {
    (async () => {
      const db = query(collection(firestore, "messages"));
      const res = await getDocs(db);
      const data = res.docs.map(doc => ({
        id: doc.id,
      }));
      if (cropArea !== undefined) {
        setImg(await cropImages(profilePic, cropArea));
      }
      setData(data);
    })();
  }, []);

  useEffect(() => {
    if (type === "personal") {
      (async () => {
        const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_PROFILE_DETAILS_BY_ISSUER}`, {
          method: "GET",
          headers: {
            body: JSON.stringify({
              issuer: message?.sender,
            }),
          },
        });
        setSenderName(data?.profileDetails?.data?.users[0]);
        // setImg(
        //   await cropImages(
        //     data?.profileDetails?.data?.users[0].profilePic,
        //     data?.profileDetails?.data?.users[0].cropArea
        //   )
        // );
      })();
    }
  }, []);
  return (
    <>
      {type === "global" ? (
        <>
          {userRedux.issuer === sender ? (
            <motion.div
              className={styles.sender}
              animate={{ opacity: [0, 1], scale: [0.9, 1] }}
              tabIndex={0}
              aria-label={`${displayName} says: ${text} at ${startingDate[0]}`}
            >
              <div className={styles.senderMessage}>
                <h1 className={styles.profileName}>{displayName}</h1>
                <h1 className={styles.chatMessage}>{text}</h1>
                <span className={styles.tooltipS}>{startingDate[0]}</span>
              </div>
              <div className={styles.chatProfilePic}>
                <div
                  className={styles.chatProfileImg}
                  style={{ marginLeft: ".3rem", position: "relative" }}
                >
                  {userRedux.profilePic === null ? (
                    <div className={styles.noPicture}>
                      <p className={styles.asd}>{displayName[0]}</p>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className={styles.receiver}
              animate={{ opacity: [0, 1], scale: [0.9, 1] }}
              tabIndex={0}
              aria-label={`${displayName} says: ${text} at ${startingDate[0]}`}
            >
              <div className={styles.chatProfilePic}>
                <div
                  className={styles.chatProfileImg}
                  style={{ marginRight: ".3rem", position: "relative" }}
                >
                  {profilePic === null ? (
                    <div className={styles.noPicture}>
                      <p className={styles.asd}>{displayName[0]}</p>
                    </div>
                  ) : (
                    <Image
                      src={img || profilePic}
                      alt=""
                      priority
                      blurDataURL={profilePic}
                      layout="fill"
                    />
                  )}
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
      ) : (
        <>
          {senderName !== undefined ? (
            <>
              {userRedux.issuer === sender ? (
                <motion.div
                  className={styles2.sender}
                  animate={{ opacity: [0, 1], scale: [0.9, 1] }}
                  tabIndex={0}
                  aria-label={`${userRedux.displayName} says: ${message.text} at ${startingDate[0]}`}
                >
                  <div className={styles.senderMessage}>
                    <h1 className={styles.profileName}>{userRedux.displayName}</h1>
                    <h1 className={styles.chatMessage}>{message.text}</h1>
                    <span className={styles.tooltipS}>{startingDate[0]}</span>
                  </div>
                  <div className={styles.chatProfilePic}>
                    <div
                      className={styles.chatProfileImg}
                      style={{ marginLeft: ".3rem", position: "relative" }}
                    >
                      {userRedux.profilePic === null ? (
                        <div className={styles.noPicture}>
                          <p className={styles.asd}>{userRedux.displayName[0]}</p>
                        </div>
                      ) : (
                        <Image
                          src={
                            userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic
                          }
                          alt=""
                          layout="fill"
                          objectFit="cover"
                          priority
                          blurDataURL={
                            userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic
                          }
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className={styles2.receiver}
                  animate={{ opacity: [0, 1], scale: [0.9, 1] }}
                  tabIndex={0}
                  aria-label={`${senderName.displayName} says: ${message.text} at ${startingDate[0]}`}
                >
                  <div className={styles.chatProfilePic}>
                    <div
                      className={styles.chatProfileImg}
                      style={{ marginRight: ".3rem", position: "relative" }}
                    >
                      {profilePic === null ? (
                        <div className={styles.noPicture}>
                          <p className={styles.asd}>{senderName.displayName[0]}</p>
                        </div>
                      ) : (
                        <Image
                          src={img || senderName.profilePic}
                          alt=""
                          priority
                          blurDataURL={senderName.profilePic}
                          layout="fill"
                        />
                      )}
                    </div>
                  </div>
                  <div className={styles.receiverMessage}>
                    <h1 className={styles.profileName}>{senderName.displayName}</h1>
                    <h1 className={styles.chatMessage}>{message.text}</h1>
                    <span className={styles.tooltip}>{startingDate[0]}</span>
                  </div>
                </motion.div>
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default ChatMessage;
