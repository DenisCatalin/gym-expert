import styles from "../../css/NewsID.module.css";
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
  const [fetched, setFetched] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [img, setImage] = useState();

  const userRedux = useSelector(state => state.user.user);

  const firestore = firebase.firestore();
  const notificationsRef = firestore.collection("notifications");
  const friendsRef = firestore.collection("friends");
  const queryQ = notificationsRef.orderBy("createdAt");
  const queryW = friendsRef.orderBy("id");
  //@ts-ignore
  const [notifications] = useCollectionData(queryQ, { id: "id" });
  const [friends] = useCollectionData(queryW, { id: "id" });

  const dispatch = useDispatch();

  useEffect(() => {
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
      setFetched(true);

      friends?.map(friend => {
        const { issuer, friendName } = friend;
        if (issuer === userRedux.issuer && displayName === friendName) {
          setIsFriend(true);
        }
      });
    })();
  }, [friends]);

  useEffect(() => {
    (async () => {
      if (dataProfile !== undefined && dataProfile.cropArea !== undefined) {
        const img = await cropImages(dataProfile.profilePic, JSON.parse(dataProfile.cropArea));
        setImage(img);
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

  const removeFriend = async () => {
    const actualID = await getDocumentIdByFieldValue(
      "issuer",
      userRedux.issuer,
      "friendName",
      displayName
    );
    try {
      await firestore.collection("friends").doc(actualID).delete();
      console.log(`Document with ID ${actualID} was successfully deleted.`);
      dispatch(
        setSnackbar({
          open: true,
          content: `You have successfully removed ${displayName} from your friends list`,
        })
      );
    } catch (error) {
      console.error(`Error deleting document with ID ${actualID}:`, error);
    }
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
              <p>{dataProfile.displayName}</p>
              <p>{dataProfile.email}</p>
              {img && (
                <Image
                  src={img}
                  alt=""
                  width={100}
                  height={100}
                  // layout="fill"
                />
              )}
              <p>{dataProfile.testimonial}</p>
              <p>{dataProfile.registerDate}</p>
              {displayName === userRedux.displayName ? null : (
                <>
                  {isFriend === false ? (
                    <button onClick={addFriend}>Add friend</button>
                  ) : (
                    <button onClick={() => removeFriend("")}>Remove friend</button>
                  )}
                </>
              )}
            </div>
          ) : (
            <CircularProgress color="secondary" />
          )}
        </>
      )}
    </div>
  );
};

export default ViewProfile;
