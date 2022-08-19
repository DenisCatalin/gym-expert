import styles from "../css/Profile.module.css";
import Header from "../components/Header/header.component";
import LinearProgress from "@mui/material/LinearProgress";
import { useContext, useState } from "react";
import { userContext } from "../lib/userContext";
import AccordionProfile from "../components/Profile-Accordion/accordion.component";
import Head from "next/head";
import ProfilePic from "../components/PhotoCrop/profile-pic.component";
import CustomSnackbar from "../components/Snackbar/snackbar.component";

const Profile = () => {
  const { user, setUser } = useContext(userContext);
  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Profile</title>
      </Head>
      <Header />
      <CustomSnackbar />
      <div className={styles.content}>
        {user.logged ? (
          <>
            <ProfilePic />
            <AccordionProfile />
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
