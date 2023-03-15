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
import { Dialog } from "../../interface/Dialog";
import { Button } from "../../interface/Button";
import { CANCEL_SUBSCRIPTION_DIALOG } from "../../utils/captions";
import { MotionButton } from "../../interface/MotionButton";
import fetchData from "../../utils/fetchData";
import { MotionTypo } from "../../interface/MotionTypo";
import { useRouter } from "next/router";
import Input from "../../interface/Input";

const ChangeNameAccordion = ({ ariaControls, name, expanded, handleChange }: IAccordion) => {
  const [isLoading, setIsLoading] = useState(false);
  const [secretKeyword, setSecretKeyword] = useState("");
  const [newName, setNewName] = useState("");

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
      if (newName === "") {
        setSnackbarMessage("The new display name must be provided.");
        setIsLoading(false);
        return;
      }
      if (newName.length < 3) {
        setSnackbarMessage("The new display name must be at least 3 characters long.");
        setIsLoading(false);
        return;
      }
      if (secretKeyword === "") {
        setSnackbarMessage("The secret keyword must be provided.");
        setIsLoading(false);
        return;
      }
      if (secretKeyword !== userRedux.secretKeyword) {
        setSnackbarMessage("Wrong secret keyword.");
        setIsLoading(false);
        return;
      }
      const data2 = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_CHECK_NAME}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            newName: newName,
          }),
        },
      });
      if (data2.CheckDisplayNameQueryForUser === 0) {
        await fetchData(`${process.env.NEXT_PUBLIC_FETCH_CHANGE_NAME}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
              newName: newName,
            }),
          },
        });
        setSecretKeyword("");
        setNewName("");
        dispatch(setUserState({ ...userRedux, displayName: newName }));
        setSnackbarMessage("You have successfully changed your display name.");
      } else setSnackbarMessage("Display name already exists!");
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
          <div className={styles.spacer2}>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content="Display Name"
            />
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content={<>{userRedux.displayName}</>}
            />
          </div>
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          <Input
            label={"Desired display name"}
            color="warning"
            type={"text"}
            className={styles.textField}
            value={newName}
            onChange={(e: any) => setNewName(e.target.value)}
          />
          <Input
            label={"Secret keyword"}
            color="warning"
            type="password"
            onChange={(e: any) => setSecretKeyword(e.target.value)}
            className={styles.textField}
            value={secretKeyword}
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

export default ChangeNameAccordion;
