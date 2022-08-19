import { useState, useEffect, useContext } from "react";
import Header from "../components/Header/header.component";
import styles from "../css/About.module.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import useWindowDimensions from "../utils/useWindowDimensions";
import AboutContainer from "../components/About/About.component";
import { useRouter } from "next/router";
import Team from "../components/Team/team.component";
import Testimonials from "../components/Testimonials/testimonials.component";
import Head from "next/head";
import { userContext } from "../lib/userContext";
import { theme2 } from "../utils/muiTheme";
import CustomSnackbar from "../components/Snackbar/snackbar.component";

const About = () => {
  const { width } = useWindowDimensions();
  const [scrollValue, setScrollValue] = useState(0);
  const router = useRouter();

  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    const onScroll = (e) => {
      setScrollValue(e.target.documentElement.scrollTop);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    router.push("/about");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>
          Gym Expert -{" "}
          {router.asPath === "/about"
            ? "About"
            : router.asPath === "/about#team"
            ? "Team"
            : "Testimonials"}
        </title>
      </Head>
      <CustomSnackbar />
      <Header sticky={true} />
      {scrollValue > width / 3 ? (
        <ThemeProvider theme={theme2}>
          <motion.button
            className={styles.scrollToTop}
            onClick={scrollToTop}
            animate={{ opacity: [0, 1] }}
            initial={{ opacity: 0 }}
            whileTap={{ scale: 0.9 }}
          >
            <KeyboardArrowUpIcon
              color="neutral"
              className={styles.scrollToTopIcon}
            />
          </motion.button>
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
