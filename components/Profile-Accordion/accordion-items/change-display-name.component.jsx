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
import { setDisplayNameRedux } from "../../../redux/user.slice";

const ChangeDisplayName = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [secretKeyword, setSecretKeyword] = useState("");
  const { snackbarContent, setSnackbarContent } = useContext(snackbarContext);

  const userRedux = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changeDisplayName = async () => {
    setIsLoading(true);
    if (userRedux.logged) {
      if (newName === "") {
        setSnackbarContent("The new display name must be provided.");
        setIsLoading(false);
        return;
      }
      if (newName.length < 3) {
        setSnackbarContent(
          "The new display name must be at least 3 characters long."
        );
        setIsLoading(false);
        return;
      }
      if (secretKeyword === "") {
        setSnackbarContent("The secret keyword must be provided.");
        setIsLoading(false);
        return;
      }
      if (secretKeyword !== userRedux.secretKeyword) {
        setSnackbarContent("Wrong secret keyword.");
        setIsLoading(false);
        return;
      }
      const res2 = await fetch("/api/checkDisplayName", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            newName: newName,
          }),
        },
      });
      const data2 = await res2.json();
      if (data2.CheckDisplayNameQueryForUser === 0) {
        const res2 = await fetch("/api/changeDisplayName", {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
              newName: newName,
            }),
          },
        });
        const data2 = await res2.json();
        console.log(data2);
        setSecretKeyword("");
        setNewName("");
        dispatch(setDisplayNameRedux(newName));
        setSnackbarContent("You have successfully changed your display name.");
      } else setSnackbarContent("Display name already exists");
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
          <Typography
            sx={{ width: "33%", flexShrink: 0 }}
            className={styles.text}
          >
            Display Name
          </Typography>
          <Typography sx={{ color: "text.secondary" }} className={styles.text}>
            {userRedux.displayName}
          </Typography>
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          <TextField
            label="Desired Display Name"
            id="newName"
            color="warning"
            className={styles.textField}
            onChange={(e) => setNewName(e.target.value)}
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
        </div>
        <motion.button
          whileHover={{
            opacity: 0.75,
          }}
          initial={{ y: 0 }}
          whileTap={{ scale: 0.9 }}
          className={styles.accordionButton}
          onClick={changeDisplayName}
        >
          {isLoading ? <CircularProgress color="inherit" /> : "Save"}
        </motion.button>
      </AccordionDetails>
    </Accordion>
  );
};

export default ChangeDisplayName;
