//@ts-nocheck

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
import { MotionButton } from "../../../interface/MotionButton";
import fetchData from "../../../utils/fetchData";
import { MotionTypo } from "../../../interface/MotionTypo";
import { setReviewState } from "../../../redux/review.slice";
import { setTestimonialState } from "../../../redux/testimonial.slice";

function getLabelText(rating) {
  return `${rating} Star${rating !== 1 ? "s" : ""}, ${ratingLabels[rating]}`;
}

type IPost = {
  placeholder: string | undefined;
};

const PostTestimonial = ({ placeholder }: IPost) => {
  const [rating, setRating] = useState<number | null>(0);
  const [hover, setHover] = useState(-1);
  const [testimonial, setTestimonial] = useState<string>("");

  const userRedux = useSelector((state: any) => state.user.user);
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
    if (testimonial !== "") {
      if (userRedux.testimonial === true) {
        await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_TESTIMONIAL}`, {
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
        dispatch(setReviewState(false));
        dispatch(setTestimonialState(testimonial));
      } else {
        await fetchData(`${process.env.NEXT_PUBLIC_FETCH_ADD_TESTIMONIAL}`, {
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

        await fetchData(`${process.env.NEXT_PUBLIC_FETCH_ADD_TESTIMONIAL_USER}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
            }),
          },
        });
        dispatch(setReviewState(false));
        dispatch(setTestimonialState(testimonial));
        dispatch(setUserState({ ...userRedux, testimonial: true }));
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
            <MotionTypo
              className={styles.title}
              animateOptions="opacity"
              content={"Post a review"}
            />
          </div>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder={placeholder}
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
                    <SendIcon htmlColor="#ffffff" className={styles.buttonIcon} />
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
