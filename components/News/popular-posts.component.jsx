import styles from "../../css/components/NewsPopular.module.css";
import { useEffect, useState } from "react";
import PopularNews from "./popular-news.component";
import CircularProgress from "@mui/material/CircularProgress";
import fetchData from "../../utils/fetchData";
import { MotionTypo } from "../../interface/MotionTypo";

const PopularPosts = () => {
  const [posts, setPosts] = useState();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    (async () => {
      if (!fetched) {
        const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_POPULAR_POSTS}`, {
          method: "POST",
        });
        setPosts(data?.getPopularNewsForUser?.data?.news);
        setFetched(true);
      }
    })();
  }, [posts]);

  return (
    <div className={styles.popularPosts}>
      {fetched ? (
        <MotionTypo
          className={styles.title}
          animateOptions={"opacity"}
          transitionDuration={2}
          content={"Popular posts"}
        />
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
