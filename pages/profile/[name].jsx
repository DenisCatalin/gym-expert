import styles from "../../css/NewsID.module.css";
import UseRedirectUser from "../../utils/redirectUser";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MotionTypo } from "../../interface/MotionTypo";
import fetchData from "../../utils/fetchData";
import { cropImages } from "../../lib/cropImages";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "../../lib/firebase";
import { useSelector } from "react-redux";

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
  const [img, setImage] = useState();

  const userRedux = useSelector(state => state.user.user);

  const firestore = firebase.firestore();
  const notificationsRef = firestore.collection("notifications");
  const queryQ = notificationsRef.orderBy("createdAt");
  //@ts-ignore
  const [notifications] = useCollectionData(queryQ, { id: "id" });

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
    })();
  }, []);

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
            <button onClick={addFriend}>Add friend</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewProfile;
