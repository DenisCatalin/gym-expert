import React from "react";
import styles from "../../css/components/NewsPost.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Post = ({ id, image, title, content, date, views }) => {
  const reveal = +`0.${id}`;
  const router = useRouter();

  return (
    <motion.div
      className={styles.post}
      animate={{ opacity: [0, 1], scale: [0.3, 1] }}
      transition={{ delay: reveal, duration: 1 }}
      onClick={() => router.push(`news/${id}`)}
    >
      <div className={styles.profile}>
        <div className={styles.profilePic}>
          <Image src={image} alt={title} layout="fill" objectFit="cover" priority />
        </div>
      </div>
      <div className={styles.postInfo}>
        <h1 className={styles.title}>
          {title.length > 35 ? <>{title.substring(0, 60)}... </> : title}
        </h1>
        <h3 className={styles.postText}>
          {content.length > 35 ? (
            <>
              {content.substring(0, 450)}... <span className={styles.readMore}>read more</span>
            </>
          ) : (
            content
          )}
        </h3>
      </div>
    </motion.div>
  );
};
export default Post;
