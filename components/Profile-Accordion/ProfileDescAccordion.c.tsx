import React, { useEffect, useState } from "react";
import { IAccordion } from "./Accordions.c";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../../css/components/Accordion.module.css";
import { theme2 } from "../../utils/muiTheme";
import { TextareaAutosize, ThemeProvider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../redux/user.slice";
import { setSnackbar } from "../../redux/snackbar.slice";
import fetchData from "../../utils/fetchData";
import { MotionTypo } from "../../interface/MotionTypo";
import { MotionButton } from "../../interface/MotionButton";

const ProfileDescAccordion = ({ ariaControls, name, expanded, handleChange }: IAccordion) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileDescription, setProfileDescription] = useState<string>("");

  const userRedux = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  function setSnackbarMessage(message: string) {
    dispatch(
      setSnackbar({
        open: true,
        content: message,
      })
    );
  }

  useEffect(() => {
    setProfileDescription(userRedux?.description);
  }, [userRedux]);

  const handleClick = async () => {
    setIsLoading(true);
    if (userRedux.logged) {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_USERS_DESCRIPTION}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            description: profileDescription,
          }),
        },
      });

      dispatch(setUserState({ ...userRedux, description: profileDescription }));
      setSnackbarMessage("You have successfully changed your profile description.");
    }
    setIsLoading(false);
  };
  return (
    <MuiAccordion
      expanded={expanded === name}
      onChange={handleChange(name)}
      className={styles.accordion}
    >
      <ThemeProvider theme={theme2}>
        <AccordionSummary
          expandIcon={<EditIcon htmlColor="#fff" />}
          aria-controls={`${ariaControls}-panel`}
          id={`${ariaControls}-header`}
        >
          <MotionTypo
            className={styles.text}
            animateOptions="opacityScale"
            content="Profile Description"
          />
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div className={styles.privacyContainer}>
          <div className={styles.profileDescription}>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content="Set or edit yourProfile Description"
            />
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder={
                userRedux.description === "" ? "Your profile description" : userRedux.description
              }
              style={{ height: "100%" }}
              onChange={(e: any) => setProfileDescription(e.target.value)}
              className={styles.textarea}
              value={profileDescription}
            />
            <MotionButton
              hover={"opacity"}
              tap
              initialOptions={{ y: 0 }}
              className={styles.profileDescSaveButton}
              onClick={handleClick}
              label={<>{isLoading ? <CircularProgress color="inherit" /> : "Save"}</>}
            />
          </div>
        </div>
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default ProfileDescAccordion;
