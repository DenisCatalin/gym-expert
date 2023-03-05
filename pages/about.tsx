import React, { useRef } from "react";
import { useInView } from "framer-motion";
import styles from "../css/About.module.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ThemeProvider } from "@mui/material/styles";
import AboutContainer from "../components/About/About.c";
import { useRouter } from "next/router";
import Team from "../components/Team/Team.c";
import Testimonials from "../components/Testimonials/Testimonials.c";
import Head from "next/head";
import { theme2 } from "../utils/muiTheme";
import { ROUTES } from "../Routes";
import { MotionButton } from "../interface/MotionButton";

const About = () => {
  const router = useRouter();

  const refAbout = useRef<any>(null);
  const refTeam = useRef<any>(null);
  const refTestimonials = useRef<any>(null);
  const isInView = useInView(refTestimonials, { once: false });

  const scrollToTop = (e: any) => {
    e.preventDefault();
    refAbout.current.scrollIntoView({ behavior: "smooth" });
    router.push(ROUTES.about);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - About</title>
      </Head>
      {isInView ? (
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
        <div className={styles.space} ref={refAbout}></div>
        <AboutContainer />
      </section>
      <section className={styles.teamContainer} ref={refTeam} id="team">
        <Team />
      </section>
      <section className={styles.testimonialsContainer} id="testimonials">
        <div className={styles.space} ref={refTestimonials}></div>
        <Testimonials />
      </section>
    </div>
  );
};

export default About;
