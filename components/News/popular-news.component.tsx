import Image from "next/image";
import styles from "../../css/components/NewsPopular.module.css";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ROUTES } from "../../Routes";

type IPopularNews = {
  id: number;
  title: string;
  content: string;
  image: string;
  date: string;
  views: number;
};

const PopularNews = ({ id, title, content, image, date, views }: IPopularNews) => {
  const router = useRouter();
  const reveal = +`0.${id}`;
  return (
    <motion.div
      className={styles.postsContainer}
      onClick={() => router.push(`/${ROUTES.news}/${id}`)}
      animate={{ opacity: [0, 1], x: [500, 0] }}
      transition={{ delay: reveal, duration: 1 }}
      onKeyDown={event => event.code === "Enter" && router.push(`/${ROUTES.news}/${id}`)}
    >
      <div className={styles.postMin} tabIndex={0} role="link">
        <div className={styles.left}>
          <div className={styles.popularPostPic}>
            <Image src={image} alt={title} layout="fill" objectFit="cover" />
          </div>
        </div>
        <div className={styles.right}>
          <h2 className={styles.postTitle}>
            {title.length > 30 ? <>{title.substring(0, 25)}... </> : title}
          </h2>
          <h2 className={styles.contentPopular}>
            {content.length > 35 ? <>{content.substring(0, 60)}... </> : content}
          </h2>
        </div>
      </div>
    </motion.div>
  );
};

export default PopularNews;
