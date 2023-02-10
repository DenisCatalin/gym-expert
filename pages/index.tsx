import Head from "next/head";
import styles from "../css/Home.module.css";
import Header from "../components/Header/Header.c";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import CustomSnackbar from "../components/Snackbar/Snackbar.c";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { MotionButton } from "../interface/MotionButton";
import { MotionTypo } from "../interface/MotionTypo";
import { useSelector } from "react-redux";
import { useState } from "react";
import Popup from "../components/Popup/Popup";
import { ROUTES } from "../Routes";

const Home = () => {
  const router = useRouter();
  const userRedux = useSelector((state: any) => state.user.user);
  const otherRedux = useSelector((state: any) => state.other.other);
  const [showPopup, setShowPopup] = useState(false);

  const { displayName, secretKeyword, email } = userRedux;
  const { popup, userFetched } = otherRedux;

  useEffect(() => {
    if (
      (userRedux.displayName === null && !popup && userFetched) ||
      (userRedux.secretKeyword === null && !popup && userFetched) ||
      (userRedux.secretKeyword === "NULL" && !popup && userFetched)
    ) {
      setShowPopup(true);
    }
  }, [userRedux]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Homepage</title>
      </Head>
      <CustomSnackbar />
      {showPopup ? (
        <Popup
          popupFor="newUser"
          title={`Hello, ${email.split("@").slice(0, -1)}!`}
          contentStyles={styles.background}
          textStyles={styles.text}
          contentText={`You haven't set your ${displayName === null ? "display name" : ""}
          ${displayName === null && secretKeyword === null ? " and " : ""}
           ${secretKeyword === null ? "secret keyword " : ""}yet. Would you like to set it now?`}
          onClickPositive={() => router.push(ROUTES.profile)}
        />
      ) : null}
      <motion.div
        className={styles.hero}
        transition={{ delay: 0.2 }}
        animate={{ opacity: [0, 1] }}
        initial={{ opacity: 0 }}
      >
        <MotionTypo
          className={styles.title}
          animateOptions="fromRightL"
          initialOptions={{ x: -500 }}
          content="Best exercises platform for gym enthusiasts at affordable prices"
        />
        <MotionButton
          hover={"boxShadow"}
          tap
          animateOptions={{ y: [-500, 0] }}
          initialOptions={{ y: 0 }}
          className={styles.mainButton}
          onClick={() => router.push(ROUTES.pricing)}
          label={
            <>
              Get started <ChevronRightIcon style={{ fontSize: "1.2em" }} />
            </>
          }
        />
      </motion.div>
      <motion.div
        className={styles.heroImage}
        animate={{ opacity: [0, 1], y: [500, 0] }}
        initial={{ opacity: 0 }}
      >
        <Image src={"/static/undraw_healthy_habit_bh-5-w.svg"} alt="" layout="fill" priority />
      </motion.div>
    </div>
  );
};

export default Home;
