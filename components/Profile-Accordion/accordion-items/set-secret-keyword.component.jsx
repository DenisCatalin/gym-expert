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
import { setSnackbar } from "../../../redux/snackbar.slice";
import { MotionButton } from "../../../interface/MotionButton";
import fetchData from "../../../utils/fetchData";
import { MotionTypo } from "../../../interface/MotionTypo";

const SetSecretKey = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secretKeyword, setSecretKeyword] = useState("");
  const [secretKeywordConfirm, setSecretKeywordConfirm] = useState("");

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

  const setUpKeyword = async () => {
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
    setSecretKeyword("");
    setSecretKeywordConfirm("");
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
          <MotionTypo
            className={styles.text}
            animateOptions="opacityScale"
            content="Set up a Secret Key"
          />
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          <TextField
            label="Desired Secret Keyword"
            id="secretKey"
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
            label="Confirm Secret Keyword"
            id="secretKeyConfirm"
            color="warning"
            type="password"
            onChange={e => setSecretKeywordConfirm(e.target.value)}
            className={styles.textField}
            value={secretKeywordConfirm}
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
          hover={"opacity"}
          tap
          initialOptions={{ y: 0 }}
          className={styles.accordionButton}
          onClick={setUpKeyword}
          label={<>{isLoading ? <CircularProgress color="inherit" /> : "Set Keyword"}</>}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default SetSecretKey;
