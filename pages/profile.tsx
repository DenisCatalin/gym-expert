import styles from "../css/Profile.module.css";
import Header from "../components/Header/Header.c";
import LinearProgress from "@mui/material/LinearProgress";
import Accordions from "../components/Profile-Accordion/Accordions.c";
import Head from "next/head";
import ProfilePic from "../components/PhotoCrop/ProfilePic.c";
import CustomSnackbar from "../components/Snackbar/Snackbar.c";
import { useSelector } from "react-redux";

const Profile = () => {
  const userRedux = useSelector((state: any) => state.user.user);
  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Profile</title>
      </Head>
      <Header />
      <CustomSnackbar />
      <div className={styles.content}>
        {userRedux.logged ? (
          <>
            <ProfilePic />
            <Accordions />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100vh",
            }}
          >
            <LinearProgress color="secondary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
