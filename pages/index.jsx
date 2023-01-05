import Head from "next/head";
import styles from "../css/Home.module.css";
import Header from "../components/Header/header.component";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import CustomSnackbar from "../components/Snackbar/snackbar.component";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ROUTES } from "../Routes";
import { MotionButton } from "../interface/MotionButton.tsx";
import { MotionTypo } from "../interface/MotionTypo.tsx";

const Home = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Homepage</title>
      </Head>
      <Header />
      <CustomSnackbar />
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
