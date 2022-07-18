import { motion } from "framer-motion";
import styles from "../../../css/components/TestimonialsCardFocus.module.css";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import { ratingLabels } from "../../../lib/ratingLabels";
import { useState } from "react";

const CardFocus = ({ name, pic, text, date, rating }) => {
  return (
    <motion.div
      className={styles.cardFocus}
      animate={{ scale: [1, 0, 0, 1] }}
      transition={{
        delay: 0,
        duration: 1.8,
      }}
    >
      <div className={styles.profile}>
        <motion.div
          className={styles.profilePic}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 3 }}
        ></motion.div>
      </div>
      <div className={styles.name}>
        <motion.h1
          className={styles.profileName}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 3 }}
        >
          {name}
        </motion.h1>
      </div>
      <div className={styles.testimonialContent}>
        <motion.h1
          className={styles.testimonial}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 3 }}
        >
          {text}
        </motion.h1>
      </div>
      <motion.div
        className={styles.rating}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 3 }}
      >
        <Rating
          name="text-feedback"
          value={rating}
          readOnly
          precision={0.5}
          size="large"
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Box sx={{ ml: 2 }}>{ratingLabels[rating]}</Box>
      </motion.div>
    </motion.div>
  );
};

export default CardFocus;
