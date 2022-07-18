import React from "react";
import styles from "../../css/components/Team.module.css";
import TeamProfile from "./profile/team-profile.component";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

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

const Team = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <h1 className={styles.teamButtonText}>Our team</h1>
      <div className={styles.content}>
        <TeamProfile image={"/static/test.jpg"} />
        <TeamProfile image={"/static/test2.jpg"} />
        <TeamProfile image={"/static/test.jpg"} />
      </div>
      <ThemeProvider theme={theme2}>
        <motion.button
          className={styles.ourTeamButton}
          whileHover={{
            boxShadow: "0px 0px 10px rgba(220, 130, 242, .65)",
          }}
          animate={{ y: [200, 0] }}
          initial={{ y: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("#testimonials")}
        >
          <h1 className={styles.teamButtonText}>Testimonials</h1>
          <KeyboardDoubleArrowDownIcon
            color="neutral"
            className={styles.teamButtonIcon}
          />
        </motion.button>
      </ThemeProvider>
    </div>
  );
};

export default Team;
