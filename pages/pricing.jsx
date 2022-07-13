import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../css/Pricing.module.css";
import Header from "../components/Header/header.component";
import Image from "next/image";
import VerifiedIcon from "@mui/icons-material/Verified";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

const Pricing = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <motion.div
          className={styles.card}
          animate={{ opacity: [0, 1], x: [-400, 0] }}
        >
          <div className={styles.imageCard}>
            <Image
              src={"/static/undraw_mindfulness_scgo.svg"}
              alt=""
              layout="fill"
            />
          </div>
          <div className={styles.cardContent}>
            <h1 className={styles.planPrice}>$35</h1>
            <h1 className={styles.planName}>The Plan Name</h1>
            <div className={styles.planFeatures}>
              <ThemeProvider theme={theme2}>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
              </ThemeProvider>
            </div>
            <motion.button
              className={styles.planButton}
              animate={{ y: [100, 0], opacity: [0, 1] }}
              whileTap={{ scale: 0.9 }}
            >
              Select Plan
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className={styles.cardBig}
          animate={{ opacity: [0, 1], y: [400, 0] }}
        >
          <div className={styles.imageCard}>
            <Image
              src={"/static/undraw_activity_tracker_re_2lvv.svg"}
              alt=""
              layout="fill"
            />
          </div>
          <div className={styles.cardContent}>
            <h1 className={styles.planPrice}>$35</h1>
            <h1 className={styles.planName}>The Plan Name</h1>
            <div className={styles.planFeatures}>
              <ThemeProvider theme={theme2}>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
              </ThemeProvider>
            </div>
            <motion.button
              className={styles.planButton}
              animate={{ y: [100, 0], opacity: [0, 1] }}
              whileTap={{ scale: 0.9 }}
            >
              Select Plan
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className={styles.card}
          animate={{ opacity: [0, 1], x: [400, 0] }}
        >
          <div className={styles.imageCard}>
            <Image
              src={"/static/undraw_fitness_tracker_3033.svg"}
              alt=""
              layout="fill"
            />
          </div>
          <div className={styles.cardContent}>
            <h1 className={styles.planPrice}>$35</h1>
            <h1 className={styles.planName}>The Plan Name</h1>
            <div className={styles.planFeatures}>
              <ThemeProvider theme={theme2}>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureText}>Select Plan</h2>
                  <VerifiedIcon color="neutral" />
                </div>
              </ThemeProvider>
            </div>
            <motion.button
              className={styles.planButton}
              animate={{ y: [100, 0], opacity: [0, 1] }}
              whileTap={{ scale: 0.9 }}
            >
              Select Plan
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
