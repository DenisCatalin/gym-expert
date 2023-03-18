import React, { useState } from "react";
import { IAccordion } from "./Accordions.c";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../../css/components/Accordion.module.css";
import { theme2 } from "../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../redux/user.slice";
import { setSnackbar } from "../../redux/snackbar.slice";
import ButtonGroup from "@mui/material/ButtonGroup";
import fetchData from "../../utils/fetchData";
import { MotionTypo } from "../../interface/MotionTypo";
import { Button } from "../../interface/Button";

interface UserPrivacy {
  gallery: string;
  badges: string;
  exercises: string;
  links: string;
}

const PrivacyAccordion = ({ ariaControls, name, expanded, handleChange }: IAccordion) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [galleryPrivacy, setGalleryPrivacy] = useState<string>("");

  const userRedux: any = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  function setSnackbarMessage(message: string) {
    dispatch(
      setSnackbar({
        open: true,
        content: message,
      })
    );
  }

  const handleClick = async (value: string, field: string) => {
    setIsLoading(true);
    if (userRedux.logged) {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_USERS_PRIVACY}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            privacy: {
              gallery: field === "gallery" ? value : userRedux.privacy.gallery,
              badges: field === "badges" ? value : userRedux.privacy.badges,
              exercises: field === "exercises" ? value : userRedux.privacy.exercises,
              links: field === "links" ? value : userRedux.privacy.links,
            },
          }),
        },
      });
      dispatch(
        setUserState({
          ...userRedux,
          privacy: {
            gallery: field === "gallery" ? value : userRedux.privacy.gallery,
            badges: field === "badges" ? value : userRedux.privacy.badges,
            exercises: field === "exercises" ? value : userRedux.privacy.exercises,
            links: field === "links" ? value : userRedux.privacy.links,
          },
        })
      );
      setSnackbarMessage("You have successfully changed your privacy for your gallery.");
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
          <MotionTypo className={styles.text} animateOptions="opacityScale" content="Privacy" />
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div className={styles.privacyContainer}>
          <div className={styles.privacyItem}>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content="Who can see my gallery?"
            />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              {isLoading ? (
                <CircularProgress color="secondary" />
              ) : (
                <>
                  <Button
                    label={"me"}
                    onClick={() => handleClick("me", "gallery")}
                    className={
                      userRedux.privacy.gallery === "me"
                        ? styles.selectedPrivacy
                        : styles.nonSelectedPrivacy
                    }
                  />
                  <Button
                    label={"friends"}
                    className={
                      userRedux.privacy.gallery === "friends"
                        ? styles.selectedPrivacy
                        : styles.nonSelectedPrivacy
                    }
                    onClick={() => handleClick("friends", "gallery")}
                  />
                  <Button
                    label={"everyone"}
                    className={
                      userRedux.privacy.gallery === "everyone"
                        ? styles.selectedPrivacy
                        : styles.nonSelectedPrivacy
                    }
                    onClick={() => handleClick("everyone", "gallery")}
                  />
                </>
              )}
            </ButtonGroup>
          </div>
          <div className={styles.privacyItem}>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content="Who can see my favorite exercises?"
            />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button
                label={"me"}
                onClick={() => handleClick("me", "exercises")}
                className={
                  userRedux.privacy.exercises === "me"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
              <Button
                label={"friends"}
                onClick={() => handleClick("friends", "exercises")}
                className={
                  userRedux.privacy.exercises === "friends"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
              <Button
                label={"everyone"}
                onClick={() => handleClick("everyone", "exercises")}
                className={
                  userRedux.privacy.exercises === "everyone"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
            </ButtonGroup>
          </div>
          <div className={styles.privacyItem}>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content="Who can see my badges?"
            />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button
                label={"me"}
                onClick={() => handleClick("me", "badges")}
                className={
                  userRedux.privacy.badges === "me"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
              <Button
                label={"friends"}
                onClick={() => handleClick("friends", "badges")}
                className={
                  userRedux.privacy.badges === "friends"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
              <Button
                label={"everyone"}
                onClick={() => handleClick("everyone", "badges")}
                className={
                  userRedux.privacy.badges === "everyone"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
            </ButtonGroup>
          </div>
          <div className={styles.privacyItem}>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content="Who can see my social links?"
            />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button
                label={"me"}
                onClick={() => handleClick("me", "links")}
                className={
                  userRedux.privacy.links === "me"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
              <Button
                label={"friends"}
                onClick={() => handleClick("friends", "links")}
                className={
                  userRedux.privacy.links === "friends"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
              <Button
                label={"everyone"}
                onClick={() => handleClick("everyone", "links")}
                className={
                  userRedux.privacy.links === "everyone"
                    ? styles.selectedPrivacy
                    : styles.nonSelectedPrivacy
                }
              />
            </ButtonGroup>
          </div>
        </div>
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default PrivacyAccordion;
