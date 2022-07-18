import { motion } from "framer-motion";
import styles from "../../css/components/Testimonials.module.css";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Card from "./card/testimonials-card.component";
import CardFocus from "./card-big/testimonials-card-focus.component";
import useWindowDimensions from "../../utils/useWindowDimensions";
import ResponsiveCard from "./responsive-card/testimonials-responsive-card";
import { getTestimonials } from "../../lib/testimonials";
import { useState, useEffect } from "react";

const theme2 = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#434343",
      darker: "#434343",
    },
    neutral: {
      main: "#EEE",
      contrastText: "#EEE",
    },
    dark: {
      main: "#434343",
      contrastText: "#434343",
    },
  },
});
const Testimonials = () => {
  const { width } = useWindowDimensions();
  const testimonials = getTestimonials();
  const [reviews, setReviews] = useState(null);
  const [count, setCount] = useState(0);
  const [review, setReview] = useState(testimonials[0]);
  const [reviewLeft, setReviewLeft] = useState(
    testimonials[testimonials.length]
  );
  const [reviewRight, setReviewRight] = useState(testimonials[1]);
  const [fetched, setFetched] = useState(false);
  const [variant, setVariant] = useState(false);

  useEffect(() => {
    setReviews(testimonials);
    setFetched(true);
    setReview(testimonials[count]);
    setReviewLeft(testimonials[count]);
    setReviewRight(testimonials[count]);
  }, []);

  useEffect(() => {
    setFetched(true);
    setReview(testimonials[count]);
    if (reviews !== null) {
      if (count === 0) {
        setReviewLeft(reviews[testimonials.length - 1]);
        setReviewRight(reviews[count + 1]);
      } else if (count === 5) {
        setReviewLeft(reviews[count - 1]);
        setReviewRight(reviews[0]);
        console.log(count - 1, review[0]);
      } else {
        setReviewRight(reviews[count + 1]);
        setReviewLeft(reviews[count - 1]);
      }
    }

    console.log(count);
  }, [reviews, count, reviews]);

  const decreaseReview = () => {
    setFetched(false);
    const testimonials = reviews.length;
    if (count === 0) {
      setCount(testimonials - 1);
    } else setCount(count - 1);
  };

  const increaseReview = () => {
    setFetched(false);
    setVariant(!variant);
    const testimonials = reviews.length;
    if (count === testimonials - 1) {
      setCount(0);
    } else setCount(count + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>What our clients say</h1>
        <div className={styles.testimonials}>
          <div className={styles.blur}>
            <div className={styles.arrows}>
              <ThemeProvider theme={theme2}>
                <motion.button
                  className={styles.arrowBackground}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 1 }}
                  onClick={decreaseReview}
                >
                  <ChevronLeftRoundedIcon
                    color="neutral"
                    className={styles.arrowIcon}
                  />
                </motion.button>
                <motion.button
                  className={styles.arrowBackground}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 1 }}
                  onClick={increaseReview}
                >
                  <ChevronRightRoundedIcon
                    color="neutral"
                    className={styles.arrowIcon}
                  />
                </motion.button>
              </ThemeProvider>
            </div>
          </div>
          {fetched ? (
            <>
              {width > 1520 ? (
                <>
                  <CardFocus
                    name={review.Name}
                    pic={review.ProfilePic}
                    text={review.Testimonial}
                    date={review.Date}
                    rating={review.Rating}
                    variant={variant}
                  />
                  <Card
                    name={reviewLeft.Name}
                    pic={reviewLeft.ProfilePic}
                    text={reviewLeft.Testimonial}
                    date={reviewLeft.Date}
                    rating={reviewLeft.Rating}
                    right={true}
                  />
                  <Card
                    name={reviewRight.Name}
                    pic={reviewRight.ProfilePic}
                    text={reviewRight.Testimonial}
                    date={reviewRight.Date}
                    rating={reviewRight.Rating}
                    right={false}
                  />
                </>
              ) : (
                <ResponsiveCard
                  name={review.Name}
                  pic={review.ProfilePic}
                  text={review.Testimonial}
                  date={review.Date}
                  rating={review.Rating}
                />
              )}
            </>
          ) : null}
        </div>
        <div className={styles.review}>
          <ThemeProvider theme={theme2}>
            <motion.button
              className={styles.reviewButton}
              whileHover={{
                boxShadow: "0px 0px 10px rgba(220, 130, 242, .65)",
              }}
              animate={{ x: [-500, 0], opacity: [0, 1] }}
              initial={{ y: 0 }}
              whileTap={{ scale: 0.9 }}
            >
              <h1 className={styles.reviewButtonText}>Review</h1>
              <KeyboardDoubleArrowRightIcon color="neutral" />
            </motion.button>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
