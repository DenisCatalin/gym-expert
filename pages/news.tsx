import Head from "next/head";
import { useState, useEffect } from "react";
import Header from "../components/Header/Header.c";
import Post from "../components/News/NewsPost.c";
import PopularPosts from "../components/News/PopularPosts.c";
import styles from "../css/News.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";
import useWindowDimensions from "../utils/useWindowDimensions";
import fetchData from "../utils/fetchData";

const News = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [fetched, setFetched] = useState(false);
  const [search, setSearch] = useState("");
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    (async () => {
      if (!fetched) {
        if (search === "") {
          const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_GET_NEWS}`, {
            method: "POST",
          });
          setPosts(data?.getNewsForUser?.data?.news);
          setFetched(true);
        } else {
          const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_GET_NEWS_BY_NAME}`, {
            method: "POST",
            headers: {
              body: JSON.stringify({
                name: search,
              }),
            },
          });
          setPosts(data?.getNewsByNameForUser?.data?.news);
          setFetched(true);
        }
      }
    })();
  }, [posts, fetched]);

  useEffect(() => {
    if (search === "") {
      setFetched(false);
    }
  }, [search]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - News</title>
      </Head>
      <Header />
      {width > 820 && width > height ? (
        <div className={styles.content}>
          <div className={styles.rightSide}>
            {fetched ? (
              <>
                {posts.length !== 0 ? (
                  <>
                    {posts.map(item => (
                      <Post
                        key={item.ID}
                        id={item.ID}
                        image={item.Image}
                        title={item.Title}
                        content={item.Content}
                        date={item.Date}
                        views={item.Views}
                      />
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <h1
                      style={{
                        color: "var(--white)",
                        fontFamily: "var(--font)",
                      }}
                    >
                      No post found
                    </h1>
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress color="secondary" />
              </div>
            )}
          </div>
          <div className={styles.leftSide}>
            <div className={styles.searchInput}>
              {fetched ? (
                <motion.input
                  className={styles.input}
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                  placeholder="Search for post titles..."
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      setFetched(false);
                    }
                  }}
                  animate={{ opacity: [0, 1], scale: [0.5, 1] }}
                  transition={{ duration: 2 }}
                />
              ) : null}
            </div>
            <PopularPosts />
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.leftSide}>
            <div className={styles.searchInput}>
              {fetched ? (
                <motion.input
                  className={styles.input}
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                  placeholder="Search for post titles..."
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      setFetched(false);
                    }
                  }}
                  animate={{ opacity: [0, 1], scale: [0.5, 1] }}
                  transition={{ duration: 2 }}
                />
              ) : null}
            </div>
            <PopularPosts />
          </div>
          <div className={styles.rightSide}>
            {fetched ? (
              <>
                {posts.length !== 0 ? (
                  <>
                    {posts.map(item => (
                      <Post
                        key={item.ID}
                        id={item.ID}
                        image={item.Image}
                        title={item.Title}
                        content={item.Content}
                        date={item.Date}
                        views={item.Views}
                      />
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <h1
                      style={{
                        color: "var(--white)",
                        fontFamily: "var(--font)",
                      }}
                    >
                      No post found
                    </h1>
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress color="secondary" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
