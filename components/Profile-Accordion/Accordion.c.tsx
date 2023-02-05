import React, { useState } from "react";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../../css/components/Accordion.module.css";
import { theme2 } from "../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import TextField from "@mui/material/TextField";
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
import { ROUTES } from "../../Routes";
import { useRouter } from "next/router";

type IAccordion = {
  type: "displayName" | "setKeyword" | "changeKeyword" | "subscription";
  ariaControls: string;
};

const Accordion = ({ type, ariaControls }: IAccordion) => {
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secretKeyword, setSecretKeyword] = useState("");
  const [secretKeywordConfirm, setSecretKeywordConfirm] = useState("");
  const [newSecretKeyword, setNewSecretKeyword] = useState("");
  const [newSecretKeywordConfirm, setNewSecretKeywordConfirm] = useState("");
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const userRedux = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const dateToExpire = new Date(Math.round(userRedux.planExpireDate) * 1000);
  const subscribedSince = new Date(Math.round(userRedux.subscribedSince) * 1000);

  const startingDate = subscribedSince.toString().split("GMT");
  const expireString = dateToExpire.toString().split("GMT");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (panel: any) => (event: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  function setSnackbarMessage(message: string) {
    dispatch(
      setSnackbar({
        open: true,
        content: message,
      })
    );
  }

  const handleClick = async () => {
    switch (type) {
      case "displayName": {
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
        break;
      }
      case "setKeyword": {
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
        break;
      }
      case "changeKeyword": {
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
        break;
      }
      case "subscription": {
        setIsLoading(true);

        dispatch(
          setUserState({
            ...userRedux,
            paidPlan: null,
            planExpireDate: 0,
            subscribedSince: 0,
          })
        );

        await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_SUBSCRIPTION}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
              planExpireDate: userRedux.planExpireDate,
              paidPlan: userRedux.paidPlan,
              subscribedIn: 0,
            }),
          },
        });
        setIsLoading(false);
        handleClose();
        dispatch(
          setSnackbar({
            open: true,
            content: "You have successfully canceled your subscription.",
          })
        );
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <MuiAccordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
      className={styles.accordion}
    >
      <ThemeProvider theme={theme2}>
        <AccordionSummary
          expandIcon={<EditIcon htmlColor="#fff" />}
          aria-controls={`${ariaControls}-panel`}
          id={`${ariaControls}-header`}
        >
          {type === "subscription" ? (
            <>
              <div className={styles.spacer2}>
                <MotionTypo
                  className={styles.text}
                  animateOptions="opacityScale"
                  content="Manage Subscription"
                />

                <MotionTypo
                  animateOptions="opacityScale"
                  className={styles.text}
                  content={<>{userRedux.paidPlan ? "Subscribed" : "Not subscribed"}</>}
                />
              </div>
            </>
          ) : type === "displayName" ? (
            <>
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
            </>
          ) : type === "changeKeyword" ? (
            <>
              <MotionTypo
                className={styles.text}
                animateOptions="opacityScale"
                content="Change secret keyword"
              />
            </>
          ) : (
            <>
              <MotionTypo
                className={styles.text}
                animateOptions="opacityScale"
                content="Set up a Secret Key"
              />
            </>
          )}
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          {type === "subscription" ? (
            <>
              <div>
                {userRedux.planExpireDate ? (
                  <>
                    <MotionTypo
                      className={styles.text}
                      animateOptions="opacityScale"
                      content={
                        <>
                          Subscribed Since:{" "}
                          {userRedux.subscribedSince === 0 ? "Not subscribed" : startingDate[0]}
                        </>
                      }
                    />

                    <MotionTypo
                      className={styles.text}
                      animateOptions="opacityScale"
                      content={
                        <>
                          Subscription expiring:{" "}
                          {userRedux.planExpireDate > Date.now() ? "Expired" : expireString[0]}
                        </>
                      }
                    />
                  </>
                ) : null}
              </div>
            </>
          ) : type === "displayName" || type === "setKeyword" ? (
            <>
              <TextField
                label={type === "displayName" ? "Desired display name" : "Desired Secret Keyword"}
                id={type === "displayName" ? "displayName" : "DsecretKey"}
                color="warning"
                type={type === "displayName" ? "text" : "password"}
                className={styles.textField}
                value={type === "displayName" ? newName : secretKeyword}
                onChange={e =>
                  type === "displayName"
                    ? setNewName(e.target.value)
                    : setSecretKeyword(e.target.value)
                }
                inputProps={{
                  style: {
                    color: "white",
                    borderRadius: "5px",
                  },
                }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <TextField
                label={type === "displayName" ? "Secret keyword" : "Confirm Secret Keyword"}
                id={type === "displayName" ? "secretKey" : "CsecretKey"}
                color="warning"
                type="password"
                onChange={e =>
                  type === "displayName"
                    ? setSecretKeyword(e.target.value)
                    : setSecretKeywordConfirm(e.target.value)
                }
                className={styles.textField}
                value={type === "displayName" ? secretKeyword : secretKeywordConfirm}
                inputProps={{
                  style: {
                    color: "white",
                    borderRadius: "5px",
                  },
                }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </>
          ) : (
            <>
              <TextField
                label="Current Secret Keyword"
                id="CsecretKey"
                color="warning"
                type="password"
                className={styles.textField}
                value={secretKeyword}
                onChange={e => setSecretKeyword(e.target.value)}
                inputProps={{
                  style: {
                    color: "white",
                    borderRadius: "5px",
                  },
                }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <TextField
                label="Desired Secret Keyword"
                id="DsecretKey"
                color="warning"
                type="password"
                className={styles.textField}
                value={newSecretKeyword}
                onChange={e => setNewSecretKeyword(e.target.value)}
                inputProps={{
                  style: {
                    color: "white",
                    borderRadius: "5px",
                  },
                }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <TextField
                label="Confirm Secret Keyword"
                id="secretKeyConfirm"
                color="warning"
                type="password"
                onChange={e => setNewSecretKeywordConfirm(e.target.value)}
                className={styles.textField}
                value={newSecretKeywordConfirm}
                inputProps={{
                  style: {
                    color: "white",
                    borderRadius: "5px",
                  },
                }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <MotionTypo
                className={styles.text}
                onClick={() => router.push(ROUTES.forgotKeyword)}
                onKeyDown={event => event.code === "Enter" && router.push(ROUTES.forgotKeyword)}
                animateOptions="opacityScale"
                content={<span className={styles.forgotLabel}>Forgot secret keyword</span>}
              />
            </>
          )}
        </div>
        {type === "subscription" ? (
          <>
            <MotionButton
              hover={"opacity"}
              tap
              initialOptions={{ y: 0 }}
              className={styles.accordionButton}
              onClick={handleOpen}
              style={{
                display: userRedux.subscribedSince === 0 ? "none" : "initial",
              }}
              label={<>{isLoading ? <CircularProgress color="inherit" /> : "Cancel"}</>}
            />
          </>
        ) : (
          <>
            <MotionButton
              hover={"opacity"}
              tap
              initialOptions={{ y: 0 }}
              className={styles.accordionButton}
              onClick={handleClick}
              label={<>{isLoading ? <CircularProgress color="inherit" /> : "Save"}</>}
            />
          </>
        )}
        {type === "subscription" ? (
          <>
            <Dialog
              open={open}
              onClose={handleClose}
              title={CANCEL_SUBSCRIPTION_DIALOG.title}
              contentStyles={styles.background}
              textStyles={styles.text}
              contentText={CANCEL_SUBSCRIPTION_DIALOG.content}
              actions={
                <>
                  <Button color="secondary" onClick={handleClose} label="No" />
                  <Button color="secondary" onClick={handleClick} autoFocus={true} label="Yes" />
                </>
              }
            />
          </>
        ) : null}
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default Accordion;
