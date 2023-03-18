import styles from "../../css/components/Testimonials.module.css";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ThemeProvider } from "@mui/material/styles";
import ResponsiveCard from "./responsive-card/TestimonialCard.c";
import { useState, useEffect, useRef } from "react";
import { magic } from "../../lib/magic-client";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import { theme2 } from "../../utils/muiTheme";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../redux/snackbar.slice";
import { ROUTES } from "../../Routes";
import { MotionButton } from "../../interface/MotionButton";
import fetchData from "../../utils/fetchData";
import { setReviewState } from "../../redux/review.slice";

type ITestimonial = {
  name?: string;
  profilePic?: string;
  text?: string;
  date?: string;
  rating?: number;
};

const Testimonials = () => {
  const [testimonial, setTestimonial] = useState<ITestimonial | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [testimonials, setTestimonials] = useState<any>([]);
  const [open, setOpen] = useState(false);

  const count = useRef<number>(0);

  const userRedux = useSelector((state: any) => state.user.user);
  const reviewRedux = useSelector((state: any) => state.review.review);
  const testimonialsRedux = useSelector((state: any) => state.testimonial.testimonial);
  const dispatch = useDispatch();

  const router = useRouter();

  const handleClickOpen = async () => {
    setIsLoading(true);
    //@ts-ignore
    const isLoggedIn = await magic.user.isLoggedIn();
    if (!isLoggedIn) router.push(ROUTES.login);
    else {
      if (userRedux.testimonial === false) {
        dispatch(setReviewState(true));
        setOpen(reviewRedux);
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

  useEffect(() => {
    setTestimonial(testimonials[count.current]);
  }, [testimonials]);

  useEffect(() => {
    setFetched(false);
    (async () => {
      const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_GET_TESTIMONIALS}`, {
        method: "GET",
      });
      setFetched(true);
      setTestimonials(data?.getTestimonialsForUser?.data?.testimonials);
    })();
  }, [testimonialsRedux]);

  const decreaseReview = () => {
    const reviews = testimonials.length;
    if (count.current === 0) {
      setTestimonial(testimonials[reviews - 1]);
      count.current = reviews - 1;
    } else {
      count.current = count.current - 1;
      setTestimonial(testimonials[count.current]);
    }
  };

  const increaseReview = () => {
    const reviews = testimonials.length;
    if (count.current === reviews - 1) {
      count.current = 0;
    } else {
      count.current = count.current + 1;
    }
    setTestimonial(testimonials[count.current]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title} tabIndex={0}>
          What our clients say
        </h1>
        <div className={styles.testimonials}>
          <div className={styles.blur}>
            {testimonials?.length < 2 ? null : (
              <div className={styles.arrows}>
                <ThemeProvider theme={theme2}>
                  <MotionButton
                    tap
                    hover={"scale"}
                    className={styles.arrowBackground}
                    onClick={decreaseReview}
                    label={
                      <>
                        <ChevronLeftRoundedIcon htmlColor="#fff" className={styles.arrowIcon} />
                      </>
                    }
                  />
                  <MotionButton
                    tap
                    hover={"scale"}
                    className={styles.arrowBackground}
                    onClick={increaseReview}
                    label={
                      <>
                        <ChevronRightRoundedIcon htmlColor="#fff" className={styles.arrowIcon} />
                      </>
                    }
                  />
                </ThemeProvider>
              </div>
            )}
          </div>
          {fetched && testimonial ? (
            <>
              <ResponsiveCard
                name={testimonial?.name}
                profilePic={testimonial?.profilePic}
                text={testimonial?.text}
                date={testimonial?.date}
                rating={testimonial?.rating}
              />
            </>
          ) : null}
        </div>
        <div className={styles.review}>
          <ThemeProvider theme={theme2}>
            <MotionButton
              onClick={handleClickOpen}
              className={styles.reviewButton}
              hover={"boxShadow"}
              tap
              animateOptions={{ x: [-500, 0], opacity: [0, 1] }}
              initialOptions={{ y: 0 }}
              label={
                <>
                  {isLoading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <>
                      <h1 className={styles.reviewButtonText}>Review</h1>
                      <KeyboardDoubleArrowRightIcon htmlColor="#fff" />
                    </>
                  )}
                </>
              }
            />
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
