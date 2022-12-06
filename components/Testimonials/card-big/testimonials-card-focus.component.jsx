import { motion } from "framer-motion";
import styles from "../../../css/components/TestimonialsCardFocus.module.css";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import { ratingLabels } from "../../../lib/ratingLabels";
import EditIcon from "@mui/icons-material/Edit";
import { ThemeProvider } from "@mui/material/styles";
import { theme2 } from "../../../utils/muiTheme";
import { userContext } from "../../../lib/userContext";
import { useContext, useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PostTestimonial from "../post-testimonial/post-testimonial.component";

const CardFocus = ({ name, pic, text, date, rating }) => {
  const { user, setUser } = useContext(userContext);
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState("");

  const review = useSelector(state => state.review);
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
  }, [review]);

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
        {user.displayName === name ? (
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
        {editMode ? (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <PostTestimonial placeholder={text} />
          </Dialog>
        ) : (
          <motion.h1
            className={styles.testimonial}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 3 }}
          >
            {text}
          </motion.h1>
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
            <Box sx={{ ml: 2 }}>{ratingLabels[rating]}</Box>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CardFocus;
