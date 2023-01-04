import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import styles from "../../../css/components/Accordion.module.css";
import { theme2 } from "../../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../../redux/user.slice";
import { setSnackbar } from "../../../redux/snackbar.slice";
import { MotionButton } from "../../../interface/MotionButton.tsx";
import useFetch from "../../../utils/useFetch.tsx";

const ChangePassword = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSecretKeyword, setNewSecretKeyword] = useState("");
  const [newSecretKeywordConfirm, setNewSecretKeywordConfirm] = useState("");
  const [secretKeyword, setSecretKeyword] = useState("");

  const userRedux = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function setSnackbarMessage(message) {
    dispatch(
      setSnackbar({
        open: true,
        content: message,
      })
    );
  }

  const changeSecretKeyword = async () => {
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
      await useFetch(`${process.env.NEXT_PUBLIC_FETCH_CHANGE_KEYWORD}`, {
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
    <Accordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
      className={styles.accordion}
    >
      <ThemeProvider theme={theme2}>
        <AccordionSummary
          expandIcon={<EditIcon color="neutral" />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }} className={styles.text}>
            Secret Keyword
          </Typography>
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          <TextField
            label="Current Secret Keword"
            id="fullWidth1"
            color="warning"
            type="password"
            className={styles.textField}
            onChange={e => setSecretKeyword(e.target.value)}
            value={secretKeyword}
            inputProps={{
              style: {
                color: "white",
                borderRadius: "5px",
              },
            }}
            InputLabelProps={{ style: { color: "white" } }}
          />
          <TextField
            label="Desired Secret Keword"
            id="fullWidth2"
            color="warning"
            type="password"
            className={styles.textField}
            onChange={e => setNewSecretKeyword(e.target.value)}
            value={newSecretKeyword}
            inputProps={{
              style: {
                color: "white",
                borderRadius: "5px",
              },
            }}
            InputLabelProps={{ style: { color: "white" } }}
          />
          <TextField
            label="Confirm Secret Keword"
            id="fullWidth0"
            color="warning"
            type="password"
            className={styles.textField}
            onChange={e => setNewSecretKeywordConfirm(e.target.value)}
            value={newSecretKeywordConfirm}
            inputProps={{
              style: {
                color: "white",
                borderRadius: "5px",
              },
            }}
            InputLabelProps={{ style: { color: "white" } }}
          />
        </div>
        <MotionButton
          tap
          hover={"opacity"}
          initialOptions={{ y: 0 }}
          className={styles.accordionButton}
          onClick={changeSecretKeyword}
          label={<>{isLoading ? <CircularProgress color="inherit" /> : "Save"}</>}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ChangePassword;
