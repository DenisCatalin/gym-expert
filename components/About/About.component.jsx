import React from "react";
import styles from "../../css/components/About.module.css";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ABOUT_TYPOGRAPHY } from "../../utils/captions";

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

const AboutContainer = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <motion.div className={styles.content} animate={{ scale: [0, 1] }}>
        <div className={styles.imageAbout}></div>
        <div className={styles.textSide}>
          <h1 className={styles.aboutTitle}>About us</h1>
          <div className={styles.aboutTextContainer}>
            <div className={styles.aboutTextContent}>
              <h1>{ABOUT_TYPOGRAPHY.mainContent}</h1>
            </div>
          </div>
        </div>
      </motion.div>
      <ThemeProvider theme={theme2}>
        <motion.button
          className={styles.ourTeamButton}
          whileHover={{
            boxShadow: "0px 0px 10px rgba(220, 130, 242, .65)",
          }}
          animate={{ y: [200, 0] }}
          initial={{ y: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("#team")}
        >
          <h1 className={styles.teamButtonText}>Our Team</h1>
          <KeyboardDoubleArrowDownIcon color="neutral" className={styles.teamButtonIcon} />
        </motion.button>
      </ThemeProvider>
    </div>
  );
};

export default AboutContainer;
