import React, { useEffect, useState } from "react";
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
import fetchData from "../../utils/fetchData";
import { MotionTypo } from "../../interface/MotionTypo";
import Input from "../../interface/Input";
import { MotionButton } from "../../interface/MotionButton";

const SocialAccordion = ({ ariaControls, name, expanded, handleChange }: IAccordion) => {
  const [isLoading, setIsLoading] = useState(false);
  const [instagram, setInstagram] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [twitch, setTwitch] = useState<string>("");
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");

  const userRedux = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setInstagram(userRedux?.links?.instagram);
    setTwitch(userRedux?.links?.twitch);
    setTwitter(userRedux?.links?.twitter);
    setYoutube(userRedux?.links?.youtube);
    setFacebook(userRedux?.links?.facebook);
    setLinkedIn(userRedux?.links?.linkedIn);
  }, [userRedux]);

  function setSnackbarMessage(message: string) {
    dispatch(
      setSnackbar({
        open: true,
        content: message,
      })
    );
  }

  const handleClick = async () => {
    setIsLoading(true);
    if (userRedux.logged) {
      const data2 = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_USERS_LINKS}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            links: {
              instagram,
              twitter,
              twitch,
              youtube,
              facebook,
              linkedIn,
            },
          }),
        },
      });
      console.log(data2);
      dispatch(
        setUserState({
          ...userRedux,
          links: {
            instagram,
            twitter,
            twitch,
            youtube,
            facebook,
            linkedIn,
          },
        })
      );
      setSnackbarMessage("You have successfully changed your display name.");
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
            content="Social links"
          />
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div className={styles.privacyContainer}>
          <div className={styles.socialItem}>
            <MotionTypo
              className={styles.textSocial}
              animateOptions="opacityScale"
              content="Instagram"
            />
            <Input
              label={"Instagram link"}
              color="warning"
              type="text"
              onChange={(e: any) => setInstagram(e.target.value)}
              className={styles.textField}
              value={instagram}
            />
          </div>
          <div className={styles.socialItem}>
            <MotionTypo
              className={styles.textSocial}
              animateOptions="opacityScale"
              content="Facebook"
            />
            <Input
              label={"Facebook link"}
              color="warning"
              type="text"
              onChange={(e: any) => setFacebook(e.target.value)}
              className={styles.textField}
              value={facebook}
            />
          </div>
          <div className={styles.socialItem}>
            <MotionTypo
              className={styles.textSocial}
              animateOptions="opacityScale"
              content="Twitter"
            />
            <Input
              label={"Twitter link"}
              color="warning"
              type="text"
              onChange={(e: any) => setTwitter(e.target.value)}
              className={styles.textField}
              value={twitter}
            />
          </div>
          <div className={styles.socialItem}>
            <MotionTypo
              className={styles.textSocial}
              animateOptions="opacityScale"
              content="LinkedIn"
            />
            <Input
              label={"LinkedIn link"}
              color="warning"
              type="text"
              onChange={(e: any) => setLinkedIn(e.target.value)}
              className={styles.textField}
              value={linkedIn}
            />
          </div>
          <div className={styles.socialItem}>
            <MotionTypo
              className={styles.textSocial}
              animateOptions="opacityScale"
              content="Twitch"
            />
            <Input
              label={"Twitch link"}
              color="warning"
              type="text"
              onChange={(e: any) => setTwitch(e.target.value)}
              className={styles.textField}
              value={twitch}
            />
          </div>
          <div className={styles.socialItem}>
            <MotionTypo
              className={styles.textSocial}
              animateOptions="opacityScale"
              content="Youtube"
            />
            <Input
              label={"Youtube link"}
              color="warning"
              type="text"
              onChange={(e: any) => setYoutube(e.target.value)}
              className={styles.textField}
              value={youtube}
            />
          </div>
          <MotionButton
            hover={"opacity"}
            tap
            initialOptions={{ y: 0 }}
            className={styles.socialSaveButton}
            onClick={handleClick}
            label={<>{isLoading ? <CircularProgress color="inherit" /> : "Save"}</>}
          />
        </div>
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default SocialAccordion;
