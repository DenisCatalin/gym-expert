import Head from "next/head";
import styles from "../css/Home.module.css";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { MotionButton } from "../interface/MotionButton";
import { MotionTypo } from "../interface/MotionTypo";
import { useSelector } from "react-redux";
import Popup from "../components/Popup/Popup";
import { ROUTES } from "../Routes";
import { autocompleteTheme } from "../utils/muiTheme";
import Autocomplete from "../interface/Autocomplete";
import { ThemeProvider } from "@mui/material";
import fetchData from "../utils/fetchData";
import useWindowDimensions from "../utils/useWindowDimensions";

const Home = () => {
  const router = useRouter();
  const userRedux = useSelector((state: any) => state.user.user);
  const otherRedux = useSelector((state: any) => state.other.other);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<any[]>([]);
  const [hydration, setHydration] = useState<boolean>(false);

  const { displayName, secretKeyword, email, logged } = userRedux;
  const { popup, userFetched } = otherRedux;

  const { width } = useWindowDimensions();

  useEffect(() => {
    (async () => {
      const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_PROFILE_NAMES}`, {
        method: "GET",
      });
      const filteredUsers = data?.names?.data?.users.filter(
        (user: any) => user.displayName !== null
      );
      setDataSearch(filteredUsers);
    })();
  }, []);

  useEffect(() => {
    if (
      (userRedux.displayName === null && !popup && userFetched && logged) ||
      (userRedux.secretKeyword === null && !popup && userFetched && logged) ||
      (userRedux.secretKeyword === "NULL" && !popup && userFetched && logged)
    ) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
    setHydration(true);
  }, [userRedux]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Homepage</title>
      </Head>
      {width > 910 && hydration ? (
        <>
          <ThemeProvider theme={autocompleteTheme}>
            <Autocomplete label={"Search for profile name"} completions={dataSearch} />
          </ThemeProvider>
        </>
      ) : null}
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
