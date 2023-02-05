import { motion } from "framer-motion";
import styles from "../../../css/components/TestimonialsCardFocus.module.css";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import { ratingLabels } from "../../../lib/ratingLabels";
import EditIcon from "@mui/icons-material/Edit";
import { ThemeProvider } from "@mui/material/styles";
import { theme2 } from "../../../utils/muiTheme";
import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PostTestimonial from "../post-testimonial/post-testimonial.component";
import { setReviewState } from "../../../redux/review.slice";
import Image from "next/image";
import { MotionTypo } from "../../../interface/MotionTypo";

type ICard = {
  name?: string;
  profilePic?: any;
  text?: string;
  date?: string;
  rating?: number;
};

const CardFocus = ({ name, profilePic, text, date, rating }: ICard) => {
  console.log("FFFASFASFS");
  const [editMode, setEditMode] = useState(false);

  const userRedux = useSelector((state: any) => state.user.user);
  const review = useSelector((state: any) => state.review);
  const dispatch = useDispatch();

  const handleOpen = () => {
    setEditMode(true);
    dispatch(setReviewState(true));
  };

  const handleClose = () => {
    dispatch(setReviewState(false));
    setEditMode(false);
  };

  useEffect(() => {
    dispatch(setReviewState(review));
  }, []);

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
        {userRedux.displayName === name ? (
          <motion.div
            className={styles.editTestimonial}
            onClick={handleOpen}
            onKeyDown={event => event.code === "Enter" && handleOpen()}
            animate={{ opacity: [0, 1] }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1 }}
            tabIndex={0}
            aria-label="Edit review"
          >
            <ThemeProvider theme={theme2}>
              <EditIcon htmlColor="#fff" />
            </ThemeProvider>
          </motion.div>
        ) : null}
        <motion.div
          className={styles.profilePic}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 3 }}
        >
          <Image src={profilePic} alt={name} priority layout="fill" />
        </motion.div>
      </div>
      <div className={styles.name}>
        <MotionTypo
          className={styles.profileName}
          animateOptions={"opacity"}
          transitionDuration={3}
          content={<>{name}</>}
        />
        {/* {date} */}
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
        ) : (
          <MotionTypo
            className={styles.testimonial}
            animateOptions={"opacity"}
            transitionDuration={3}
            content={<>{text}</>}
          />
        )}
      </div>
      <motion.div
        className={styles.rating}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 3 }}
      >
        {editMode ? null : (
          <>
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
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CardFocus;
