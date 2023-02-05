import React from "react";
import styles from "../../css/components/About.module.css";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ABOUT_TYPOGRAPHY } from "../../utils/captions";
import { ROUTES } from "../../Routes";
import { MotionButton } from "../../interface/MotionButton";

const AboutContainer = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <motion.div className={styles.content} animate={{ scale: [0, 1] }}>
        <div className={styles.imageAbout}></div>
        <div className={styles.textSide}>
          <h1 className={styles.aboutTitle} tabIndex={0}>
            About us
          </h1>
          <div className={styles.aboutTextContainer}>
            <div className={styles.aboutTextContent}>
              <h1 tabIndex={0}>{ABOUT_TYPOGRAPHY.mainContent}</h1>
            </div>
          </div>
        </div>
      </motion.div>
      <MotionButton
        className={styles.ourTeamButton}
        hover={"boxShadow"}
        tap
        onClick={() => router.push(ROUTES.aboutTeam)}
        initialOptions={{ y: 0 }}
        animateOptions={{ y: [200, 0] }}
        label={
          <>
            <h1 className={styles.teamButtonText}>Our Team</h1>
            <KeyboardDoubleArrowDownIcon htmlColor="#fff" className={styles.teamButtonIcon} />
          </>
        }
      />
    </div>
  );
};

export default AboutContainer;
