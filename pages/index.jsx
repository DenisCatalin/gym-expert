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
        <motion.h1 className={styles.title} animate={{ x: [-500, 0] }} initial={{ x: -500 }}>
          Best exercises platform for gym enthusiasts at affordable prices
        </motion.h1>
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
