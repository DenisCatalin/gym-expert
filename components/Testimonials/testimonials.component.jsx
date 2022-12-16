import { motion } from "framer-motion";
import styles from "../../css/components/Testimonials.module.css";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ThemeProvider } from "@mui/material/styles";
import Card from "./card/testimonials-card.component";
import CardFocus from "./card-big/testimonials-card-focus.component";
import useWindowDimensions from "../../utils/useWindowDimensions";
import ResponsiveCard from "./responsive-card/testimonials-responsive-card";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { magic } from "../../lib/magic-client";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import { theme2 } from "../../utils/muiTheme";
import PostTestimonial from "./post-testimonial/post-testimonial.component";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../redux/snackbar.slice";
import { ROUTES } from "../../Routes";

const Testimonials = () => {
  const { width } = useWindowDimensions();
  const [reviews, setReviews] = useState(null);
  const [count, setCount] = useState(0);
  const [testimonial, setTestimonial] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewLeft, setReviewLeft] = useState();
  const [reviewRight, setReviewRight] = useState();
  const [fetched, setFetched] = useState(false);
  const [variant, setVariant] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [open, setOpen] = useState(false);

  const testimonialss = useSelector(state => state.testimonial.testimonial);
  const userRedux = useSelector(state => state.user.user);

  const dispatch = useDispatch();

  const router = useRouter();

  const handleClickOpen = async () => {
    setIsLoading(true);
    const isLoggedIn = await magic.user.isLoggedIn();
    if (!isLoggedIn) router.push(ROUTES.login);
    else {
      if (userRedux.testimonial === false) {
        setOpen(true);
        setIsLoading(false);
      } else {
        dispatch(
          setSnackbar({
            open: true,
            content:
              "You already posted a testimonial. You can edit it by pressing the edit icon on your testimonial.",
          })
        );
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setReviews(testimonials);
    // setFetched(true);
    setTestimonial(testimonials[count]);
    setReviewLeft(testimonials[count]);
    setReviewRight(testimonials[count]);
  }, [testimonials]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/getTestimonials", {
        method: "POST",
      });
      const data = await res.json();
      console.log(data?.getTestimonialsForUser?.data?.testimonials);
      setFetched(true);
      setTestimonials(data?.getTestimonialsForUser?.data?.testimonials);
      // setReviews(data?.getTestimonialsForUser?.data?.testimonials);
    })();
  }, [testimonialss]);

  useEffect(() => {
    if (count > 0) {
      setTestimonial(testimonials[count]);
      setFetched(true);
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
    }
  }, [reviews, count, testimonials]);

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
    ``;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>What our clients say</h1>
        <div className={styles.testimonials}>
          <div className={styles.blur}>
            {testimonials?.length < 2 ? null : (
              <div className={styles.arrows}>
                <ThemeProvider theme={theme2}>
                  <motion.button
                    className={styles.arrowBackground}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 1 }}
                    onClick={decreaseReview}
                  >
                    <ChevronLeftRoundedIcon color="neutral" className={styles.arrowIcon} />
                  </motion.button>
                  <motion.button
                    className={styles.arrowBackground}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 1 }}
                    onClick={increaseReview}
                  >
                    <ChevronRightRoundedIcon color="neutral" className={styles.arrowIcon} />
                  </motion.button>
                </ThemeProvider>
              </div>
            )}
          </div>
          {fetched ? (
            <>
              {width > 1520 ? (
                <>
                  {testimonials?.length > 2 ? (
                    <>
                      {testimonial !== undefined ? (
                        <>
                          <CardFocus
                            name={testimonial.name}
                            pic={"/static/test.jpg"}
                            text={testimonial.text}
                            date={testimonial.date}
                            rating={testimonial.rating}
                            variant={variant}
                          />
                          {reviewLeft !== undefined ? (
                            <>
                              <Card
                                name={reviewLeft.name}
                                pic={"/static/test.jpg"}
                                text={reviewLeft.text}
                                date={reviewLeft.date}
                                rating={reviewLeft.rating}
                                right={true}
                              />
                            </>
                          ) : null}
                          {reviewRight !== undefined ? (
                            <>
                              <Card
                                name={reviewRight.name}
                                pic={"/static/test.jpg"}
                                text={reviewRight.text}
                                date={reviewRight.date}
                                rating={reviewRight.rating}
                                right={false}
                              />
                            </>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {testimonial !== undefined ? (
                        <>
                          <CardFocus
                            name={testimonial.name}
                            pic={"/static/test.jpg"}
                            text={testimonial.text}
                            date={testimonial.date}
                            rating={testimonial.rating}
                          />
                        </>
                      ) : (
                        <h1 className={styles.title}>No testimonials</h1>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {testimonial !== undefined ? (
                    <>
                      <ResponsiveCard
                        name={testimonial.name}
                        pic={"/static/test.jpg"}
                        text={testimonial.text}
                        date={testimonial.date}
                        rating={testimonial.rating}
                      />
                    </>
                  ) : (
                    <h1 className={styles.title}>No testimonials</h1>
                  )}
                </>
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
              onClick={handleClickOpen}
            >
              {isLoading ? (
                <CircularProgress color="secondary" />
              ) : (
                <>
                  <h1 className={styles.reviewButtonText}>Review</h1>
                  <KeyboardDoubleArrowRightIcon color="neutral" />
                </>
              )}
            </motion.button>
          </ThemeProvider>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <PostTestimonial />
        </Dialog>
      </div>
    </div>
  );
};

export default Testimonials;
