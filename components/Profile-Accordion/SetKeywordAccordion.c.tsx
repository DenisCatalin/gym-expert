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

const SetKeywordAccordion = ({ ariaControls, name, expanded, handleChange }: IAccordion) => {
  const [isLoading, setIsLoading] = useState(false);
  const [secretKeyword, setSecretKeyword] = useState("");
  const [secretKeywordConfirm, setSecretKeywordConfirm] = useState("");

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
        setSnackbarMessage("The secret key should not be empty.");
        setIsLoading(false);
        return;
      }
      if (secretKeyword.length < 3) {
        setSnackbarMessage("The secret key must be at least 4 characters long.");
        setIsLoading(false);
        return;
      }
      if (secretKeyword !== secretKeywordConfirm) {
        setSnackbarMessage("The secret keys are not the same.");
        setIsLoading(false);
        return;
      }
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_SET_KEYWORD}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            keyword: secretKeyword,
          }),
        },
      });
      setSnackbarMessage("You have successfully set up your secret keyword.");
    }
    dispatch(setUserState({ ...userRedux, secretKeyword: secretKeyword }));
    setSecretKeyword("");
    setSecretKeywordConfirm("");
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
            content="Set up a Secret Key"
          />
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          <Input
            label={"Desired Secret Keyword"}
            color="warning"
            type={"password"}
            className={styles.textField}
            value={secretKeyword}
            onChange={(e: any) => setSecretKeyword(e.target.value)}
          />
          <Input
            label={"Confirm Secret Keyword"}
            color="warning"
            type="password"
            onChange={(e: any) => setSecretKeywordConfirm(e.target.value)}
            className={styles.textField}
            value={secretKeywordConfirm}
          />
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

export default SetKeywordAccordion;
