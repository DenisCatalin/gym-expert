import styles from "../../css/NewsID.module.css";
import UseRedirectUser from "../../utils/redirectUser";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import fetchData from "../../utils/fetchData";
import { MotionTypo } from "../../interface/MotionTypo";
import { cropImages } from "../../lib/cropImages";

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
  const [newsPost, setNews] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [img, setImage] = useState();
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

      setNews(data?.profileDetails?.data?.users[0]);
      setFetched(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (newsPost !== undefined && newsPost.cropArea !== undefined) {
        const img = await cropImages(newsPost.profilePic, JSON.parse(newsPost.cropArea));
        setImage(img);
      }
    })();
    console.log(newsPost);
  }, [newsPost]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Profile of {displayName}</title>
      </Head>
      {newsPost === undefined ? (
        <h1 style={{ color: "var(--white)", fontSize: "2em", fontFamily: "var(--font)" }}>
          Profile not found
        </h1>
      ) : (
        <>
          <div className={styles.content}>
            <p>{newsPost.displayName}</p>
            <p>{newsPost.profilePic}</p>
            <p>{newsPost.email}</p>
            {img && (
              <Image
                src={img}
                alt=""
                width={100}
                height={100}
                // layout="fill"
                style={{ borderRadius: "50%" }}
              />
            )}
            <p>{newsPost.testimonial}</p>
            <p>{newsPost.registerDate}</p>
            <p>{newsPost.cropArea}</p>
            <button>Add friend</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewProfile;
