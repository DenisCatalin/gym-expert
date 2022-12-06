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
import { useSelector, useDispatch } from "react-redux";

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

  const setUpKeyword = async () => {
    setIsLoading(true);
    if (userRedux.logged) {
      if (secretKeyword === "") {
        dispatch(
          setSnackbar({
            open: true,
            content: "The secret key should not be empty.",
          })
        );
        setIsLoading(false);
        return;
      }
      if (secretKeyword.length < 3) {
        dispatch(
          setSnackbar({
            open: true,
            content: "The secret key must be at least 4 characters long.",
          })
        );
        setIsLoading(false);
        return;
      }
      if (secretKeyword !== secretKeywordConfirm) {
        dispatch(
          setSnackbar({
            open: true,
            content: "The secret keys are not the same.",
          })
        );
        setIsLoading(false);
        return;
      }
      const res2 = await fetch("/api/setUpKeyword", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            keyword: secretKeyword,
          }),
        },
      });
      const data2 = await res2.json();
      console.log(data2);
      dispatch(
        setSnackbar({
          open: true,
          content: "You have successfully set up your secret keyword.",
        })
      );
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
          <Typography sx={{ width: "33%", flexShrink: 0 }} className={styles.text}>
            Secret Key
          </Typography>
          <Typography sx={{ color: "text.secondary" }} className={styles.text}>
            Set up a Secret Key
          </Typography>
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
        <motion.button
          whileHover={{
            opacity: 0.75,
          }}
          initial={{ y: 0 }}
          whileTap={{ scale: 0.9 }}
          className={styles.accordionButton}
          onClick={setUpKeyword}
        >
          {isLoading ? <CircularProgress color="inherit" /> : "Set Keyword"}
        </motion.button>
      </AccordionDetails>
    </Accordion>
  );
};

export default SetSecretKey;
