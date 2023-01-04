import { useState } from "react";
import Image from "next/image";
import DialogContent from "@mui/material/DialogContent";
import Rating from "@mui/material/Rating";
import { TextareaAutosize } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { theme2 } from "../../../utils/muiTheme";
import { ratingLabels } from "../../../lib/ratingLabels";
import styles from "../../../css/components/Testimonials.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../../redux/user.slice";
import { setTestimonialState } from "../../../redux/testimonial.slice";
import { setReviewState } from "../../../redux/review.slice";
import { MotionButton } from "../../../interface/MotionButton.tsx";

function getLabelText(rating) {
  return `${rating} Star${rating !== 1 ? "s" : ""}, ${ratingLabels[rating]}`;
}

const PostTestimonial = ({ placeholder = "Your message" }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [testimonial, setTestimonial] = useState("");

  const testimonialss = useSelector(state => state.testimonial.testimonial);
  const userRedux = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  let d = new Date();
  const currentMonth = d.getMonth();
  const currentDay = d.getDate();
  const currentYear = d.getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateString = `${months[currentMonth]}-${currentDay}-${currentYear}`;

  const postTestimonial = async () => {
    dispatch(setReviewState(false));
    if (testimonial !== "") {
      if (placeholder !== "Your message") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_TESTIMONIAL}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
              date: dateString,
              text: testimonial,
              rating: rating,
            }),
          },
        });
        await res.json();
        dispatch(setTestimonialState(!testimonialss.testimonial));
        dispatch(setReviewState(false));
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_ADD_TESTIMONIAL}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              displayName: userRedux.displayName,
              issuer: userRedux.issuer,
              date: dateString,
              text: testimonial,
              rating: rating,
              pic: userRedux.profilePic,
            }),
          },
        });
        await res.json();
        dispatch(setTestimonialState(!testimonialss.testimonial));

        const res2 = await fetch(`${process.env.NEXT_PUBLIC_FETCH_ADD_TESTIMONIAL_USER}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
            }),
          },
        });
        await res2.json();
        dispatch(setUserState({ ...userRedux, testimonial: true }));
        dispatch(setReviewState(false));
      }
    }
  };
  return (
    <>
      <DialogContent style={{ background: "var(--testimonialBg)" }}>
        <div className={styles.dialogContainer}>
          <div className={styles.upperSide}>
            <motion.div className={styles.image} animate={{ opacity: [0, 1] }}>
              <Image
                src={"/static/undraw_post_re_mtr4.svg"}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
            <motion.h1 className={styles.title} animate={{ opacity: [0, 1] }}>
              Post a review
            </motion.h1>
          </div>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder={placeholder}
            variant="filled"
            style={{ height: "60%" }}
            onChange={e => setTestimonial(e.target.value)}
            className={styles.textarea}
          />
          <motion.div
            className={styles.rating}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1] }}
          >
            <Rating
              name="hover-feedback"
              rating={rating}
              precision={0.5}
              getLabelText={getLabelText}
              size="large"
              onChange={(event, newrating) => {
                setRating(newrating);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {rating !== null && (
              <Box sx={{ ml: 2 }}>{ratingLabels[hover !== -1 ? hover : rating]}</Box>
            )}
          </motion.div>
          <div className={styles.buttonPost}>
            <ThemeProvider theme={theme2}>
              <MotionButton
                hover={"boxShadow"}
                tap
                animateOptions={{ x: [-500, 0], opacity: [0, 1] }}
                initialOptions={{ y: 0 }}
                onClick={postTestimonial}
                className={styles.postButton}
                label={
                  <>
                    <h1 className={styles.postButtonText}>Send</h1>
                    <SendIcon color="neutral" className={styles.buttonIcon} />
                  </>
                }
              />
            </ThemeProvider>
          </div>
        </div>
      </DialogContent>
    </>
  );
};

export default PostTestimonial;
