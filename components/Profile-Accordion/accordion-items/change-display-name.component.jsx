import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import styles from "../../../css/components/Accordion.module.css";
import { theme2 } from "../../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../../redux/user.slice";
import { setSnackbar } from "../../../redux/snackbar.slice";
import { MotionButton } from "../../../interface/MotionButton.tsx";
import fetchData from "../../../utils/fetchData.tsx";
import { MotionTypo } from "../../../interface/MotionTypo.tsx";

const ChangeDisplayName = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [secretKeyword, setSecretKeyword] = useState("");

  const userRedux = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  function setSnackbarMessage(message) {
    dispatch(
      setSnackbar({
        open: true,
        content: message,
      })
    );
  }

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changeDisplayName = async () => {
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
          <TextField
            label="Desired Display Name"
            id="newName"
            color="warning"
            className={styles.textField}
            onChange={e => setNewName(e.target.value)}
            value={newName}
            inputProps={{
              style: {
                color: "white",
                borderRadius: "5px",
              },
            }}
            InputLabelProps={{ style: { color: "white" } }}
          />
          <TextField
            label="Current Secret Keyword"
            id="secret"
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
        </div>
        <MotionButton
          tap
          hover={"opacity"}
          initialOptions={{ y: 0 }}
          className={styles.accordionButton}
          onClick={changeDisplayName}
          label={<>{isLoading ? <CircularProgress color="inherit" /> : "Save"}</>}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ChangeDisplayName;
