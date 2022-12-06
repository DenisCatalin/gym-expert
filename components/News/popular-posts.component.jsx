import styles from "../../css/components/NewsPopular.module.css";
import { useEffect, useState } from "react";
import PopularNews from "./popular-news.component";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";

const PopularPosts = () => {
  const [posts, setPosts] = useState();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    (async () => {
      if (!fetched) {
        const res = await fetch("/api/getPopularPosts", {
          method: "POST",
        });
        const data = await res.json();
        console.log(data);
        setPosts(data?.getPopularNewsForUser?.data?.news);
        setFetched(true);
      }
    })();
  }, [posts]);

  return (
    <div className={styles.popularPosts}>
      {fetched ? (
        <motion.h1
          className={styles.title}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 2 }}
        >
          Popular posts
        </motion.h1>
      ) : null}
      {fetched ? (
        posts.map(item => (
          <PopularNews
            key={item.ID}
            id={item.ID}
            image={item.Image}
            title={item.Title}
            content={item.Content}
            date={item.Date}
            views={item.Views}
          />
        ))
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
  );
};

export default PopularPosts;
