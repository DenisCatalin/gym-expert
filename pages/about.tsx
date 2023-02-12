import React, { useState, useEffect } from "react";
import styles from "../css/About.module.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ThemeProvider } from "@mui/material/styles";
import useWindowDimensions from "../utils/useWindowDimensions";
import AboutContainer from "../components/About/About.c";
import { useRouter } from "next/router";
import Team from "../components/Team/Team.c";
import Testimonials from "../components/Testimonials/Testimonials.c";
import Head from "next/head";
import { theme2 } from "../utils/muiTheme";
import { ROUTES } from "../Routes";
import { MotionButton } from "../interface/MotionButton";

const About = () => {
  const { width } = useWindowDimensions();
  const [scrollValue, setScrollValue] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollValue(e.target.documentElement.scrollTop);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = (e: any) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    router.push(ROUTES.about);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - About</title>
      </Head>
      {scrollValue > width / 3 ? (
        <ThemeProvider theme={theme2}>
          <MotionButton
            hover={"boxShadow"}
            tap
            animateOptions={{ opacity: [0, 1] }}
            initialOptions={{ opacity: 0 }}
            className={styles.scrollToTop}
            onClick={scrollToTop}
            role="button"
            ariaLabel="Scroll to top"
            tabIndex={0}
            onKeyDown={event => event.code === "Enter" && scrollToTop(event)}
            label={
              <>
                <KeyboardArrowUpIcon htmlColor="#fff" className={styles.scrollToTopIcon} />
              </>
            }
          />
        </ThemeProvider>
      ) : null}
      <section className={styles.aboutContainer} id="about">
        <div className={styles.space}></div>
        <AboutContainer />
      </section>
      <section className={styles.teamContainer} id="team">
        <Team />
      </section>
      <section className={styles.testimonialsContainer} id="testimonials">
        <div className={styles.space}></div>
        <Testimonials />
      </section>
    </div>
  );
};

export default About;
