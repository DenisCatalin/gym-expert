import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../redux/snackbar.slice";
import { setUserState } from "../../redux/user.slice";
import fetchData from "../../utils/fetchData";
import { IAccordion } from "./Accordions.c";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../../css/components/Accordion.module.css";
import { theme2 } from "../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { MotionTypo } from "../../interface/MotionTypo";
import Input from "../../interface/Input";
import { MotionButton } from "../../interface/MotionButton";
import { useRouter } from "next/router";
import { ROUTES } from "../../Routes";

const ChangeKeywordAccordion = ({ ariaControls, name, expanded, handleChange }: IAccordion) => {
  const [isLoading, setIsLoading] = useState(false);
  const [secretKeyword, setSecretKeyword] = useState("");
  const [newSecretKeyword, setNewSecretKeyword] = useState("");
  const [newSecretKeywordConfirm, setNewSecretKeywordConfirm] = useState("");

  const router = useRouter();

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
  const handleClick = async () => {
    setIsLoading(true);
    if (userRedux.logged) {
      if (secretKeyword === "") {
        setSnackbarMessage("The current secret keyword must be provided.");
        setIsLoading(false);
        return;
      }
      if (newSecretKeyword === "") {
        setSnackbarMessage("You must provide your new desired secret keyword.");
        setIsLoading(false);
        return;
      }
      if (newSecretKeywordConfirm === "") {
        setSnackbarMessage("You must confirm the new secret keyword.");
        setIsLoading(false);
        return;
      }
      if (newSecretKeywordConfirm !== newSecretKeyword) {
        setSnackbarMessage("Your new secret keywords are not the same.");
        setIsLoading(false);
        return;
      }
      if (secretKeyword !== userRedux.secretKeyword) {
        setSnackbarMessage("Wrong secret keyword.");
        setIsLoading(false);
        return;
      }
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_CHANGE_KEYWORD}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            newSecretKeyword: newSecretKeyword,
          }),
        },
      });
    }
    setIsLoading(false);
    setSecretKeyword("");
    setNewSecretKeyword("");
    setNewSecretKeywordConfirm("");

    dispatch(
      setSnackbar({
        open: true,
        content: "You have successfully changed your secret keyword.",
      })
    );
    dispatch(setUserState({ ...userRedux, secretKeyword: newSecretKeyword }));
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
            content="Change secret keyword"
          />
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          <>
            <Input
              label="Current Secret Keyword"
              color="warning"
              type="password"
              className={styles.textField}
              value={secretKeyword}
              onChange={e => setSecretKeyword(e.target.value)}
            />
            <Input
              label="Desired Secret Keyword"
              color="warning"
              type="password"
              className={styles.textField}
              value={newSecretKeyword}
              onChange={e => setNewSecretKeyword(e.target.value)}
            />
            <Input
              label="Confirm Secret Keyword"
              color="warning"
              type="password"
              onChange={e => setNewSecretKeywordConfirm(e.target.value)}
              className={styles.textField}
              value={newSecretKeywordConfirm}
            />
            <MotionTypo
              className={styles.text}
              onClick={() => router.push(ROUTES.forgotKeyword)}
              onKeyDown={event => event.code === "Enter" && router.push(ROUTES.forgotKeyword)}
              animateOptions="opacityScale"
              content={<span className={styles.forgotLabel}>Forgot secret keyword</span>}
            />
          </>
        </div>
        <MotionButton
          hover={"opacity"}
          tap
          initialOptions={{ y: 0 }}
          className={styles.accordionButton}
          onClick={handleClick}
          label={<>{isLoading ? <CircularProgress color="inherit" /> : "Save"}</>}
        />
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default ChangeKeywordAccordion;
