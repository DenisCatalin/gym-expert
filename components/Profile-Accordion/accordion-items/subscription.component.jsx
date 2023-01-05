import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import styles from "../../../css/components/Accordion.module.css";
import { theme2 } from "../../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../../redux/user.slice";
import { setSnackbar } from "../../../redux/snackbar.slice";
import { Dialog } from "../../../interface/Dialog.tsx";
import { Button } from "../../../interface/Button.tsx";
import { CANCEL_SUBSCRIPTION_DIALOG } from "../../../utils/captions";
import { MotionButton } from "../../../interface/MotionButton.tsx";
import fetchData from "../../../utils/fetchData.tsx";
import { MotionTypo } from "../../../interface/MotionTypo.tsx";

const Subscription = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const userRedux = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const dateToExpire = new Date(Math.round(userRedux.planExpireDate) * 1000);
  const subscribedSince = new Date(Math.round(userRedux.subscribedSince) * 1000);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const cancelSubscription = async () => {
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
              content="Manage Subscription"
            />

            <MotionTypo
              animateOptions="opacityScale"
              className={styles.text}
              content={<>{userRedux.paidPlan ? "Subscribed" : "Not subscribed"}</>}
            />
          </div>
        </AccordionSummary>
      </ThemeProvider>
      <AccordionDetails className={styles.accordionDetails}>
        <div>
          <MotionTypo
            className={styles.text}
            animateOptions="opacityScale"
            content={
              <>
                Subscribed Since:{" "}
                {userRedux.subscribedSince === 0 ? "Not subscribed" : subscribedSince.toString()}
              </>
            }
          />

          <MotionTypo
            className={styles.text}
            animateOptions="opacityScale"
            content={
              <>
                Subscription expiring:{" "}
                {dateToExpire < Date.now() ? "Expired" : dateToExpire.toString()}
              </>
            }
          />
        </div>
        <MotionButton
          hover={"opacity"}
          tap
          initialOptions={{ y: 0 }}
          className={styles.accordionButton}
          onClick={handleClickOpen}
          style={{
            display: userRedux.subscribedSince === 0 ? "none" : "initial",
          }}
          label={<>{isLoading ? <CircularProgress color="inherit" /> : "Cancel"}</>}
        />
      </AccordionDetails>
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
            <Button color="secondary" onClick={cancelSubscription} autoFocus={true} label="Yes" />
          </>
        }
      />
    </Accordion>
  );
};

export default Subscription;
