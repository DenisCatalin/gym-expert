import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { useContext, useState } from "react";
import styles from "../../../css/components/Accordion.module.css";
import { theme2 } from "../../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import TextField from "@mui/material/TextField";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import { snackbarContext } from "../../../lib/snackbarContext";
import { useSelector, useDispatch } from "react-redux";
import { setSecretKeywordRedux } from "../../../redux/user.slice";

const ChangePassword = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSecretKeyword, setNewSecretKeyword] = useState("");
  const [newSecretKeywordConfirm, setNewSecretKeywordConfirm] = useState("");
  const [secretKeyword, setSecretKeyword] = useState("");
  const { snackbarContent, setSnackbarContent } = useContext(snackbarContext);

  const userRedux = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changeSecretKeyword = async () => {
    setIsLoading(true);
    if (userRedux.logged) {
      if (secretKeyword === "") {
        setSnackbarContent("The current secret keyword must be provided.");
        setIsLoading(false);
        return;
      }
      if (newSecretKeyword === "") {
        setSnackbarContent("You must provide your new desired secret keyword.");
        setIsLoading(false);
        return;
      }
      if (newSecretKeywordConfirm === "") {
        setSnackbarContent("You must confirm the new secret keyword.");
        setIsLoading(false);
        return;
      }
      if (newSecretKeywordConfirm !== newSecretKeyword) {
        setSnackbarContent("Your new secret keywords are not the same.");
        setIsLoading(false);
        return;
      }
      if (secretKeyword !== userRedux.secretKeyword) {
        setSnackbarContent("Wrong secret keyword.");
        setIsLoading(false);
        return;
      }
      const res2 = await fetch("/api/changeSecretKeyword", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            newSecretKeyword: newSecretKeyword,
          }),
        },
      });
      const data2 = await res2.json();
      console.log(data2);
    }
    setIsLoading(false);
    setSecretKeyword("");
    setNewSecretKeyword("");
    setNewSecretKeywordConfirm("");
    setSnackbarContent("You have successfully changed your secret keyword.");
    dispatch(setSecretKeywordRedux(newSecretKeyword));
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
          <Typography
            sx={{ width: "33%", flexShrink: 0 }}
            className={styles.text}
          >
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
            onChange={(e) => setSecretKeyword(e.target.value)}
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
            onChange={(e) => setNewSecretKeyword(e.target.value)}
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
            onChange={(e) => setNewSecretKeywordConfirm(e.target.value)}
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
        <motion.button
          whileHover={{
            opacity: 0.75,
          }}
          initial={{ y: 0 }}
          whileTap={{ scale: 0.9 }}
          className={styles.accordionButton}
          onClick={changeSecretKeyword}
        >
          {isLoading ? <CircularProgress color="inherit" /> : "Save"}
        </motion.button>
        {/* <motion.button
          whileHover={{
            opacity: 0.75,
          }}
          initial={{ y: 0 }}
          whileTap={{ scale: 0.9 }}
          className={styles.accordionButton}
          onClick={changeSecretKeyword}
        >
          {isLoading ? null : "Forgot Secret Keyword"}
        </motion.button> */}
      </AccordionDetails>
    </Accordion>
  );
};

export default ChangePassword;
