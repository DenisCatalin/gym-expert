import React, { useState } from "react";
import styles from "../../../css/components/TestimonialsCardResponsive.module.css";
import { ratingLabels } from "../../../lib/ratingLabels";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import { ThemeProvider } from "@mui/material/styles";
import { theme2 } from "../../../utils/muiTheme";
import { setReviewState } from "../../../redux/review.slice";
import { Dialog } from "@mui/material";
import PostTestimonial from "../post-testimonial/post-testimonial.component";

const ResponsiveCard = ({ profilePic, name, date, text, rating }) => {
  const { width } = useWindowDimensions();
  const userRedux = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);

  const handleOpen = () => {
    setEditMode(true);
    dispatch(setReviewState(true));
  };

  const handleClose = () => {
    dispatch(setReviewState(false));
    setEditMode(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.profilePic}>
          <Image src={profilePic} alt="" layout="fill" objectFit="cover" priority />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.userName}>{name}</h1>
          <h3 className={styles.date}>{date}</h3>
        </div>
        {userRedux.displayName === name ? (
          <motion.div
            className={styles.editTestimonial}
            onClick={handleOpen}
            animate={{ opacity: [0, 1] }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1 }}
          >
            <ThemeProvider theme={theme2}>
              <EditIcon color="neutral" />
            </ThemeProvider>
          </motion.div>
        ) : null}
      </div>
      <div className={styles.content}>
        <h1 className={styles.testimonial}>{text}</h1>
      </div>
      <div className={styles.testimonialContent}>
        {editMode ? (
          <Dialog
            open={editMode}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <PostTestimonial placeholder={text} />
          </Dialog>
        ) : null}
      </div>
      <div className={styles.rating}>
        <Rating
          name="text-feedback"
          value={rating}
          readOnly
          precision={0.5}
          size={width > 920 ? "large" : "medium"}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Box sx={{ ml: 2 }}>{ratingLabels[rating]}</Box>
      </div>
    </div>
  );
};

export default ResponsiveCard;
