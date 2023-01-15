import { motion } from "framer-motion";
import styles from "../../../css/components/TestimonialsCard.module.css";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import { ratingLabels } from "../../../lib/ratingLabels";
import Image from "next/image";
import { MotionTypo } from "../../../interface/MotionTypo";

type ICard = {
  profilePic: string;
  name: string;
  date?: string;
  text: string;
  rating: number;
  right?: boolean;
};

const Card = ({ profilePic, name, date, text, rating, right }: ICard) => {
  return (
    <motion.div
      className={styles.card}
      animate={{ x: right ? [0, 450] : [0, -450] }}
      transition={{
        repeat: 1,
        repeatType: "reverse",
        duration: 1,
      }}
    >
      <div className={styles.profile}>
        <div className={styles.profilePic}>
          <Image src={profilePic} alt="" layout="fill" priority objectFit="cover" />
        </div>
      </div>
      <div className={styles.name}>
        <MotionTypo
          className={styles.profileName}
          animateOptions={"opacity"}
          content={<>{name}</>}
        />
      </div>
      <div className={styles.testimonialContent}>
        <MotionTypo
          className={styles.testimonial}
          animateOptions={"fromTopN"}
          content={<>{text}</>}
        />
      </div>
      <motion.div className={styles.rating} animate={{ opacity: [0, 1] }}>
        <Rating
          name="text-feedback"
          value={rating}
          readOnly
          precision={0.5}
          size="large"
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {/* @ts-ignore */}
        <Box sx={{ ml: 2 }}>{ratingLabels[rating]}</Box>
      </motion.div>
    </motion.div>
  );
};

export default Card;
