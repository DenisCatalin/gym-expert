import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { useContext, useState } from "react";
import { userContext } from "../../../lib/userContext";
import styles from "../../../css/components/Accordion.module.css";
import { theme2 } from "../../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { snackbarContext } from "../../../lib/snackbarContext";

const Subscription = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(userContext);
  const { snackbarContent, setSnackbarContent } = useContext(snackbarContext);

  const dateToExpire = new Date(Math.round(user.planExpireDate) * 1000);
  const subscribedSince = new Date(Math.round(user.subscribedSince) * 1000);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    user.paidPlan = null;
    user.planExpireDate = 0;
    user.subscribedSince = 0;
    const res2 = await fetch("/api/updateSubscription", {
      method: "POST",
      headers: {
        body: JSON.stringify({
          issuer: user.issuer,
          planExpireDate: user.planExpireDate,
          paidPlan: user.paidPlan,
          subscribedIn: 0,
        }),
      },
    });
    const data2 = await res2.json();
    console.log(data2);
    setIsLoading(false);
    handleClose();
    setSnackbarContent("You have successfully canceled your subscription.");
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
            Manage Subscription
          </Typography>
          <Typography sx={{ color: "text.secondary" }} className={styles.text}>
            {user.paidPlan ? "Subscribed" : "Not subscribed"}
          </Typography>
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          <Typography className={styles.text}>
            Subscribed Since:{" "}
            {user.subscribedSince === 0
              ? "Not subscribed"
              : subscribedSince.toString()}
          </Typography>
          <Typography className={styles.text}>
            Subscription expiring:{" "}
            {dateToExpire < Date.now() ? "Expired" : dateToExpire.toString()}
          </Typography>
        </div>
        <motion.button
          whileHover={{
            opacity: 0.75,
          }}
          initial={{ y: 0 }}
          whileTap={{ scale: 0.9 }}
          className={styles.accordionButton}
          onClick={handleClickOpen}
          style={{ display: user.subscribedSince === 0 ? "none" : "initial" }}
        >
          {isLoading ? <CircularProgress color="inherit" /> : "Cancel"}
        </motion.button>
      </AccordionDetails>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={styles.background}>
          {"We need you to be aware of the fact that..."}
        </DialogTitle>
        <DialogContent className={styles.background}>
          <DialogContentText
            id="alert-dialog-description"
            className={styles.text}
          >
            You are about to cancel your subscription. Which means that you will
            no longer be able to see the exercises page. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={styles.background}>
          <Button color="secondary" onClick={handleClose}>
            No
          </Button>
          <Button color="secondary" onClick={cancelSubscription} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Accordion>
  );
};

export default Subscription;
