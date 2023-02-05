import React from "react";
import styles from "../../css/components/Team.module.css";
import TeamProfile from "./profile/TeamProfile.c";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import { theme2 } from "../../utils/muiTheme";
import { ROUTES } from "../../Routes";
import { MotionButton } from "../../interface/MotionButton";

const Team = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <h1 className={styles.teamButtonText}>Our team</h1>
      <div className={styles.content}>
        <TeamProfile image={"/static/test.jpg"} />
        <TeamProfile image={"/static/test2.jpg"} />
        <TeamProfile image={"/static/test3.jpg"} />
      </div>
      <ThemeProvider theme={theme2}>
        <MotionButton
          hover={"boxShadow"}
          tap
          animateOptions={{ y: [200, 0] }}
          initialOptions={{ y: 0 }}
          className={styles.ourTeamButton}
          onClick={() => router.push(ROUTES.aboutTestimonials)}
          label={
            <>
              <h1 className={styles.teamButtonText}>Testimonials</h1>
              <KeyboardDoubleArrowDownIcon htmlColor="#fff" className={styles.teamButtonIcon} />
            </>
          }
        />
      </ThemeProvider>
    </div>
  );
};

export default Team;
