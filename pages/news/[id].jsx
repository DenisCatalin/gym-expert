import styles from "../../css/NewsID.module.css";
import Header from "../../components/Header/header.component";
import UseRedirectUser from "../../utils/redirectUser";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const news = context.params.id;

  return { props: { news } };
}

const NewsPost = ({ news }) => {
  const [newsPost, setNews] = useState([]);
  const [fetched, setFetched] = useState(false);
  const id = news;
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/getNewsById", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            id: id,
          }),
        },
      });
      const data = await res.json();
      setNews(data?.getNewsByIdForUser?.data?.news[0]);
      setFetched(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (newsPost !== undefined) {
        const res2 = await fetch("/api/increaseViewsForNews", {
          method: "POST",
          headers: {
            body: JSON.stringify({
              id: id,
              views: newsPost.Views + 1,
            }),
          },
        });
        const data2 = await res2.json();
        console.log(data2);
      }
    })();
  }, [newsPost]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - News</title>
      </Head>
      <Header />
      <div className={styles.content}>
        {fetched ? (
          <>
            {newsPost !== undefined ? (
              <>
                <div className={styles.titleSpace}>
                  <motion.h1
                    className={styles.title}
                    animate={{ opacity: [0, 1], scale: [0.5, 1] }}
                  >
                    {newsPost.Title}
                  </motion.h1>
                </div>
                <div className={styles.mainContent}>
                  <motion.div className={styles.postImage} animate={{ opacity: [0, 1] }}>
                    <Image
                      src={newsPost.Image}
                      alt={newsPost.Title}
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </motion.div>
                  <div className={styles.textContent}>
                    <motion.h2 className={styles.contentText} animate={{ opacity: [0, 1] }}>
                      {newsPost.Content}
                    </motion.h2>
                  </div>
                </div>
              </>
            ) : (
              <>
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "80vh",
                    }}
                  >
                    <h1 className={styles.title}>Post Not Found</h1>
                  </div>
                </>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default NewsPost;
