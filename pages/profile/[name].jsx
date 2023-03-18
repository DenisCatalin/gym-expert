import styles from "../../css/ProfileID.module.css";
import UseRedirectUser from "../../utils/redirectUser";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import fetchData from "../../utils/fetchData";
import { cropImages } from "../../lib/cropImages";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "../../lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { setSnackbar } from "../../redux/snackbar.slice";
import { Button } from "../../interface/Button";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Dialog } from "../../interface/Dialog";

export async function getServerSideProps(context) {
  const { userId } = await UseRedirectUser(context);
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const displayName = context.params.name;

  return { props: { displayName } };
}

const ViewProfile = ({ displayName }) => {
  const [dataProfile, setData] = useState([]);
  const [links, setLinks] = useState({});
  const [gallery, setGallery] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [img, setImage] = useState();
  const [hasConversation, setHasConversation] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({});
  const [viewDialog, setViewDialog] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState("");

  const userRedux = useSelector(state => state.user.user);

  const firestore = firebase.firestore();
  const [conversationsCount, setConversationsCount] = useState(0);
  const notificationsRef = firestore.collection("notifications");
  const friendsRef = firestore.collection("friends");
  const conversationsRef = firestore.collection("conversations");
  const conversationsMessagesRef = firestore.collection("conversationsMessages");
  const queryQ = notificationsRef.orderBy("createdAt");
  const queryW = friendsRef.orderBy("id");
  const queryY = conversationsRef.orderBy("createdAt");
  const queryZ = conversationsMessagesRef.orderBy("id");
  const exercisesRef = firestore.collection("favourites");
  const queryExercises = exercisesRef.orderBy("name");

  const [notifications] = useCollectionData(queryQ, { id: "id" });
  const [friends] = useCollectionData(queryW, { id: "id" });
  const [conversations] = useCollectionData(queryY, { id: "id" });
  const [conversationsMessages] = useCollectionData(queryZ, { id: "id" });
  const [favouriteExercises] = useCollectionData(queryExercises, { id: "id" });

  const dispatch = useDispatch();

  useEffect(() => {
    setIsFriend(false);
    setFetched(false);
    setHasConversation(false);
    (async () => {
      const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_PROFILE_DETAILS}`, {
        method: "GET",
        headers: {
          body: JSON.stringify({
            displayName: displayName,
          }),
        },
      });

      setData(data?.profileDetails?.data?.users[0]);
      setLinks(JSON.parse(data?.profileDetails?.data?.users[0].links));
      setGallery(JSON.parse(data?.profileDetails?.data?.users[0].gallery));
      setFetched(true);
      setPrivacySettings(JSON.parse(data?.profileDetails?.data?.users[0].privacy));
    })();
  }, [displayName]);

  useEffect(() => {
    if (fetched === true) {
      friends?.map(friend => {
        const { issuer, friendIssuer } = friend;
        if (issuer === userRedux.issuer && friendIssuer === dataProfile.issuer) {
          setIsFriend(true);
        }
      });
    }
  }, [fetched, friends, isFriend]);

  useEffect(() => {
    (async () => {
      if (dataProfile !== undefined && dataProfile.cropArea !== undefined) {
        if (dataProfile.cropArea !== "{}") {
          const img = await cropImages(dataProfile.profilePic, JSON.parse(dataProfile.cropArea));
          setImage(img);
        } else {
          setImage(dataProfile.profilePic);
        }
      }
    })();
  }, [dataProfile]);

  const addFriend = async () => {
    {
      notifications &&
        (await notificationsRef.add({
          id: notifications.length + 1,
          content: `${userRedux.displayName} has sent you a friend request. Do you want to accept it?`,
          forUser: dataProfile.issuer,
          read: false,
          sender: userRedux.displayName,
          senderIssuer: userRedux.issuer,
          title: `New friend request from ${userRedux.displayName}`,
          type: "friends",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          responded: false,
        }));
    }
  };

  async function getDocumentIdByFieldValue(field, value, field2, value2) {
    try {
      const querySnapshot = await friendsRef
        .where(field, "==", value)
        .where(field2, "==", value2)
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

  async function getDocumentIdByFieldValueSingle(field, value) {
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

  const removeFriend = async () => {
    const actualID = await getDocumentIdByFieldValue(
      "issuer",
      userRedux.issuer,
      "friendName",
      displayName
    );
    const actualID2 = await getDocumentIdByFieldValue(
      "issuer",
      dataProfile.issuer,
      "friendName",
      userRedux.displayName
    );
    {
      notifications &&
        (await notificationsRef.add({
          id: notifications.length + 1,
          content: `${userRedux.displayName} has sent removed you from their friend list.`,
          forUser: dataProfile.issuer,
          read: false,
          sender: userRedux.displayName,
          senderIssuer: userRedux.issuer,
          title: `${userRedux.displayName} removed you from their friend list`,
          type: "friends",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          responded: true,
        }));
    }
    try {
      await firestore.collection("friends").doc(actualID).delete();
      await firestore.collection("friends").doc(actualID2).delete();
      console.log(`Document with ID ${actualID} was successfully deleted.`);
      dispatch(
        setSnackbar({
          open: true,
          content: `You have successfully removed ${displayName} from your friends list`,
        })
      );
      setIsFriend(false);
    } catch (error) {
      console.error(`Error deleting document with ID ${actualID}:`, error);
    }
  };

  useEffect(() => {
    setConversationsCount(conversations?.length);
    conversations?.map((_conversation, idx) => {
      if (
        conversations[idx].participants.includes(userRedux.issuer) &&
        conversations[idx].participants.includes(dataProfile.issuer) &&
        !conversations[idx].removedUsers.includes(userRedux.issuer)
      ) {
        setHasConversation(true);
      }
    });
  }, [conversations, dataProfile, userRedux]);

  const checkConversation = async () => {
    let conversationFound = false;

    for (const [idx, conversation] of conversations.entries()) {
      if (
        conversation.participants.includes(userRedux.issuer) &&
        conversation.participants.includes(dataProfile.issuer)
      ) {
        const docID = await getDocumentIdByFieldValueSingle("id", conversation.id);
        const docRef = firestore.collection("conversations").doc(docID);

        const party = conversation?.removedUsers.filter(
          participant => participant !== userRedux.issuer
        );
        {
          docRef &&
            (await docRef.update({
              removedUsers: party,
            }));
        }

        conversationFound = true;
        break;
      }
    }

    if (!conversationFound) {
      await addConversation();
    }
  };

  const addConversation = async () => {
    {
      conversationsMessages &&
        (await conversationsMessagesRef.add({
          id: conversationsCount + 1,
          messages: [],
        }));
    }
    {
      conversations &&
        (await conversationsRef.add({
          id: conversationsCount + 1,
          participants: [userRedux.issuer, dataProfile.issuer],
          removedUsers: [],
          blockedBy: [],
          lastMessage: "",
          conversationName: null,
          conversationPhoto: null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    }
  };

  const renderFavoriteExercises = () => {
    return (
      <div className={styles.favExercises}>
        {favouriteExercises &&
          favouriteExercises?.map(exercise => (
            <>
              {exercise.issuer === dataProfile.issuer ? (
                <div className={styles.favExercisesPhoto}>
                  <Image src={exercise.gifUrl} alt="" layout="fill" className={styles.photo} />
                </div>
              ) : null}
            </>
          ))}
      </div>
    );
  };

  const renderGallery = () => {
    return (
      <div className={styles.gallery}>
        {gallery &&
          gallery?.map((photo, idx) => (
            <div className={styles.galleryPhoto} key={idx}>
              <Image
                src={photo}
                alt=""
                layout="fill"
                className={styles.actualPhoto}
                onClick={() => openViewDialog(photo)}
              />
            </div>
          ))}
      </div>
    );
  };

  const renderBadges = () => {
    return (
      <div className={styles.social}>
        <div className={styles.socialBox}></div>
        <div className={styles.socialBox}></div>
        <div className={styles.socialBox}></div>
        <div className={styles.socialBox}></div>
        <div className={styles.socialBox}></div>
        <div className={styles.socialBox}></div>
      </div>
    );
  };

  const renderSocialLinks = () => {
    return (
      <div className={styles.social}>
        {links.facebook !== null ? (
          <div className={styles.socialBox}>
            {links && (
              <a href={`${links.facebook}`} target="_blank" rel="noreferrer">
                <FacebookIcon htmlColor="#4267B2" className={styles.socialIcon} />
              </a>
            )}
          </div>
        ) : null}
        {links.instagram !== null ? (
          <div className={styles.socialBox}>
            {links && (
              <a href={`${links.instagram}`} target="_blank" rel="noreferrer">
                <InstagramIcon htmlColor="#C13584" className={styles.socialIcon} />
              </a>
            )}
          </div>
        ) : null}
        {links.twitter !== null ? (
          <div className={styles.socialBox}>
            {links && (
              <a href={`${links.twitter}`} target="_blank" rel="noreferrer">
                <TwitterIcon htmlColor="#1DA1F2" className={styles.socialIcon} />
              </a>
            )}
          </div>
        ) : null}
        {links.linkedIn !== null ? (
          <div className={styles.socialBox}>
            {links && (
              <a href={`${links.linkedIn}`} target="_blank" rel="noreferrer">
                <LinkedInIcon htmlColor="#0077B5" className={styles.socialIcon} />
              </a>
            )}
          </div>
        ) : null}
        {links.youtube !== null ? (
          <div className={styles.socialBox}>
            {links && (
              <a href={`${links.youtube}`} target="_blank" rel="noreferrer">
                <YouTubeIcon htmlColor="#FF0000" className={styles.socialIcon} />
              </a>
            )}
          </div>
        ) : null}
        {links.twitch !== null ? (
          <div className={styles.socialBox}>
            {links && (
              <a href={`${links.twitch}`} target="_blank" rel="noreferrer">
                <Image
                  src={"https://www.vectorlogo.zone/logos/twitch/twitch-icon.svg"}
                  alt=""
                  width={30}
                  height={30}
                />
              </a>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  const openViewDialog = photo => {
    setViewDialog(true);
    setCurrentPhoto(photo);
  };

  const closeViewDialog = () => {
    setViewDialog(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Profile of {displayName}</title>
      </Head>
      {dataProfile === undefined ? (
        <h1 style={{ color: "var(--white)", fontSize: "2em", fontFamily: "var(--font)" }}>
          Profile not found
        </h1>
      ) : (
        <>
          {fetched === true ? (
            <div className={styles.content}>
              <div className={styles.profileInformations}>
                <div className={styles.profileTextInfo}>
                  <div className={styles.profilePicContainer}>
                    {img && <Image src={img} alt="" layout="fill" className={styles.profilePic} />}
                  </div>
                  <div className={styles.profileName}>
                    <p className={styles.displayName}>{dataProfile.displayName}</p>
                    <p className={styles.registerDate}>Member since: {dataProfile.registerDate}</p>
                    <div className={styles.profileDescription}>
                      <p className={styles.description}>{dataProfile.description}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.profileButtonsInfo}>
                  <div className={styles.profileButtosSpacer}>
                    <div className={styles.socialAndBadges}>
                      <p className={styles.socialText}>Badges</p>
                      {privacySettings.badges === "everyone"
                        ? renderBadges()
                        : (privacySettings.badges === "friends" && isFriend) ||
                          dataProfile.issuer === userRedux.issuer
                        ? renderBadges()
                        : privacySettings.badges === "friends" && !isFriend
                        ? "This user only allow friends to see their badges"
                        : privacySettings.badges === "me" && dataProfile.issuer === userRedux.issuer
                        ? renderBadges()
                        : "This user does not allow anyone to see their badges"}
                    </div>
                    <div className={styles.socialAndBadges}>
                      <p className={styles.socialText}>Social</p>
                      {privacySettings.links === "everyone"
                        ? renderSocialLinks()
                        : (privacySettings.links === "friends" && isFriend) ||
                          dataProfile.issuer === userRedux.issuer
                        ? renderSocialLinks()
                        : privacySettings.links === "friends" && !isFriend
                        ? "This user only allow friends to see their social media links"
                        : privacySettings.links === "me" && dataProfile.issuer === userRedux.issuer
                        ? renderSocialLinks()
                        : "This user does not allow anyone to see their social media links"}
                    </div>
                  </div>
                  <div className={styles.profileButtons}>
                    {displayName === userRedux.displayName ? null : (
                      <Button
                        ariaLabel="Gift a subscription"
                        role="button"
                        className={styles.giftButton}
                        label={
                          <div className={styles.insideButton}>
                            <RedeemRoundedIcon htmlColor="#fff" />
                            <p>Gift sub</p>
                          </div>
                        }
                      />
                    )}
                    {displayName === userRedux.displayName ? null : (
                      <>
                        {isFriend === false ? (
                          <Button
                            ariaLabel="Add friend"
                            role="button"
                            className={styles.normalButton}
                            onClick={addFriend}
                            label={
                              <div className={styles.insideButton}>
                                <PersonAddRoundedIcon htmlColor="#fff" />
                                <p>Add friend</p>
                              </div>
                            }
                          />
                        ) : (
                          <Button
                            ariaLabel="Remove friend"
                            role="button"
                            className={styles.removeButton}
                            onClick={() => removeFriend()}
                            label={
                              <div className={styles.insideButton}>
                                <PersonRemoveRoundedIcon htmlColor="#fff" />
                                <p>Remove friend</p>
                              </div>
                            }
                          />
                        )}
                      </>
                    )}
                    {displayName === userRedux.displayName ? null : (
                      <>
                        {hasConversation === false ? (
                          <Button
                            ariaLabel="Start a conversation"
                            role="button"
                            className={styles.normalButton}
                            onClick={checkConversation}
                            label={
                              <div className={styles.insideButton}>
                                <CommentRoundedIcon htmlColor="#fff" />
                                <p>Message</p>
                              </div>
                            }
                          />
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.otherContainer}>
                <div className={styles.galleryContainer}>
                  <p className={styles.title}>Gallery</p>
                  {privacySettings.gallery === "everyone"
                    ? renderGallery()
                    : (privacySettings.gallery === "friends" && isFriend) ||
                      dataProfile.issuer === userRedux.issuer
                    ? renderGallery()
                    : privacySettings.gallery === "friends" && !isFriend
                    ? "This user only allow friends to see their gallery"
                    : privacySettings.gallery === "me" && dataProfile.issuer === userRedux.issuer
                    ? renderGallery()
                    : "This user does not allow anyone to see their gallery"}
                </div>
                <div className={styles.favouriteExercises}>
                  <p className={styles.title}>Favourite exercises</p>
                  {privacySettings.exercises === "everyone"
                    ? renderFavoriteExercises()
                    : (privacySettings.exercises === "friends" && isFriend) ||
                      dataProfile.issuer === userRedux.issuer
                    ? renderFavoriteExercises()
                    : privacySettings.exercises === "friends" && !isFriend
                    ? "This user only allow friends to see their favorite exercises"
                    : privacySettings.exercises === "me" && dataProfile.issuer === userRedux.issuer
                    ? renderFavoriteExercises()
                    : "This user does not allow anyone to see their favorite exercises"}
                </div>
              </div>
            </div>
          ) : (
            <CircularProgress color="secondary" />
          )}
        </>
      )}
      <Dialog
        open={viewDialog}
        onClose={closeViewDialog}
        title={"View photo"}
        fullWidth={true}
        maxWidth={"xl"}
        textStyles={styles.text}
        contentStyles={styles.backgroundView}
        contentOther={
          <>
            <Image src={currentPhoto} alt="" layout="fill" className={styles.galleryPhoto} />
          </>
        }
        actions={
          <>
            <Button label="Close" color="warning" onClick={closeViewDialog} />
          </>
        }
      />
    </div>
  );
};

export default ViewProfile;
