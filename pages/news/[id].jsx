import styles from "../../css/NewsID.module.css";
import Header from "../../components/Header/header.component";
import UseRedirectUser from "../../utils/redirectUser";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import fetchData from "../../utils/fetchData";
import { MotionTypo } from "../../interface/MotionTypo";

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
      const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_GET_NEXT_BY_ID}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            id: id,
          }),
        },
      });
      setNews(data?.getNewsByIdForUser?.data?.news[0]);
      setFetched(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (newsPost !== undefined) {
        await fetchData(`${process.env.NEXT_PUBLIC_FETCH_INCREASE_VIEWS}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              id: id,
              views: newsPost.Views + 1,
            }),
          },
        });
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
                  <MotionTypo
                    className={styles.title}
                    animateOptions="opacityScale"
                    content={<>{newsPost.Title}</>}
                  />
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
                    <MotionTypo
                      className={styles.contentText}
                      animateOptions="opacity"
                      content={<>{newsPost.Content}</>}
                    />
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
