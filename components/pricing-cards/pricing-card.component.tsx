import { motion } from "framer-motion";
import styles from "../../css/Pricing.module.css";
import VerifiedIcon from "@mui/icons-material/Verified";
import { ThemeProvider } from "@mui/material/styles";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Image from "next/image";
import { useState } from "react";
import AlertDialog from "../AlertDialog/alert-dialog.component";
import { theme2 } from "../../utils/muiTheme";
import { magic } from "../../lib/magic-client";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import { PURCHASE_DIALOG } from "../../utils/captions";
import { setSubscriptionState } from "../../redux/subscription.slice";
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../redux/dialog.slice";
import { ROUTES } from "../../Routes";
import { MotionButton } from "../../interface/MotionButton";

type IPricingCard = {
  price?: number;
  period?: any;
  image?: any;
};

const PricingCard = ({ price, period, image }: IPricingCard) => {
  const { width } = useWindowDimensions();
  const [planSelected, setPlanSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const dialog = useSelector((state: any) => state.dialog);
  const dispatch = useDispatch();

  const setScaleCard = () => {
    let scale = 1;
    if (width < 1150) {
      scale = 0.9;
    }
    return scale;
  };

  const openDialog = async () => {
    setIsLoading(true);
    setPlanSelected(true);
    //@ts-ignore
    const isLoggedIn = await magic.user.isLoggedIn();
    if (!isLoggedIn) router.push(ROUTES.login);
    else {
      dispatch(setDialog(true));
      dispatch(
        setSubscriptionState({
          price: price,
          plan: period,
        })
      );
      setPlanSelected(false);
      setIsLoading(false);
    }
  };

  const features = [
    "Access to exercises page",
    "Exercises for every body part",
    "7-day money back guarantee",
    "Cancel anytime",
  ];

  return (
    <>
      <AlertDialog
        dialogOpen={dialog}
        title={PURCHASE_DIALOG.title}
        content={PURCHASE_DIALOG.content}
      />
      <motion.div
        className={styles.card}
        animate={{ opacity: [0, 1], x: [-400, 0], scale: setScaleCard() }}
      >
        <div className={styles.imageCard}>
          <Image src={image} alt="" layout="fill" priority placeholder="blur" blurDataURL={image} />
        </div>
        <div className={styles.cardContent}>
          <h1 className={styles.planPrice}>
            ${price}/{period}
          </h1>
          <h1 className={styles.planName}>
            {period[0].toUpperCase() + period.substring(1)}ly Subscription
          </h1>
          <div className={styles.planFeatures}>
            <ThemeProvider theme={theme2}>
              {features.map((item, i) => (
                <div className={styles.feature} key={i}>
                  <h2 className={styles.featureText}>{item}</h2>
                  <VerifiedIcon htmlColor="#fff" />
                </div>
              ))}
            </ThemeProvider>
          </div>
          <MotionButton
            className={styles.planButton}
            animateOptions={{ y: [100, 0], opacity: [0, 1] }}
            tap
            hover={"scale"}
            onClick={openDialog}
            style={{ pointerEvents: planSelected ? "none" : "all" }}
            label={<>{isLoading ? <CircularProgress color="inherit" /> : "Select Plan"}</>}
          />
        </div>
      </motion.div>
    </>
  );
};

export default PricingCard;
