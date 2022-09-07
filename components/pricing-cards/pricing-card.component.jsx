import { motion } from "framer-motion";
import styles from "../../css/Pricing.module.css";
import VerifiedIcon from "@mui/icons-material/Verified";
import { ThemeProvider } from "@mui/material/styles";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Image from "next/image";
import { useContext, useState } from "react";
import { dialogContext } from "../../lib/dialogContext";
import { purchaseContext } from "../../lib/purchaseContext";
import AlertDialog from "../AlertDialog/alert-dialog.component";
import { theme2 } from "../../utils/muiTheme";
import { magic } from "../../lib/magic-client";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

const PricingCard = ({ price, period, image }) => {
  const { width } = useWindowDimensions();
  const { dialogAlert, setDialogAlert } = useContext(dialogContext);
  const [planSelected, setPlanSelected] = useState(false);
  const { subscription, setSubscription } = useContext(purchaseContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const setScaleCard = () => {
    let scale = 1;
    if (width < 1150) scale = 0.9;
    return scale;
  };

  const openDialog = async () => {
    setIsLoading(true);
    setPlanSelected(true);
    const isLoggedIn = await magic.user.isLoggedIn();
    if (!isLoggedIn) router.push("/login");
    else {
      setDialogAlert(true);
      setSubscription({
        price: price,
        plan: period,
      });
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
      <AlertDialog dialogOpen={dialogAlert} />
      <motion.div
        className={styles.card}
        animate={{ opacity: [0, 1], x: [-400, 0], scale: setScaleCard() }}
      >
        <div className={styles.imageCard}>
          <Image
            src={image}
            alt=""
            layout="fill"
            priority
            placeholder="blur"
            blurDataURL={image}
          />
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
                  <VerifiedIcon color="neutral" />
                </div>
              ))}
            </ThemeProvider>
          </div>
          <motion.button
            className={styles.planButton}
            animate={{ y: [100, 0], opacity: [0, 1] }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={openDialog}
            style={{ pointerEvents: planSelected ? "none" : "all" }}
          >
            {isLoading ? <CircularProgress color="inherit" /> : "Select Plan"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default PricingCard;
