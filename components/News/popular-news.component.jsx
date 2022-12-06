import Image from "next/image";
import styles from "../../css/components/NewsPopular.module.css";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const PopularNews = ({ id, title, content, image, date }) => {
  const router = useRouter();
  const reveal = +`0.${id}`;
  return (
    <motion.div
      className={styles.postsContainer}
      onClick={() => router.push(`/news/${id}`)}
      animate={{ opacity: [0, 1], x: [500, 0] }}
      transition={{ delay: reveal, duration: 1 }}
    >
      <div className={styles.postMin}>
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
