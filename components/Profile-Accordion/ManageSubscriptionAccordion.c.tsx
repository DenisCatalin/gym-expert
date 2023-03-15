import React, { useState } from "react";
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
import { IAccordion } from "./Accordions.c";

const ManageSubscriptionAccordion = ({
  ariaControls,
  name,
  expanded,
  handleChange,
}: IAccordion) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

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

  const handleClick = async () => {
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

    setOpen(false);
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
        </div>
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
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default ManageSubscriptionAccordion;
