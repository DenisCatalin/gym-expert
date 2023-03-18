import styles from "../css/Profile.module.css";
import LinearProgress from "@mui/material/LinearProgress";
import Accordions from "../components/Profile-Accordion/Accordions.c";
import Head from "next/head";
import ProfilePic from "../components/PhotoCrop/ProfilePic.c";
import { useSelector } from "react-redux";
import ProgressButton from "../components/ProfileButtons/ProgressButton.c";
import ScheduleButton from "../components/ProfileButtons/ScheduleButton.c";
import NutritionButton from "../components/ProfileButtons/NutritionButton.c";
import WorkoutButton from "../components/ProfileButtons/WorkoutButton.c";
import GalleryButton from "../components/ProfileButtons/GalleryButton.c";

const Profile = () => {
  const userRedux = useSelector((state: any) => state.user.user);
  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Profile</title>
      </Head>
      <div className={styles.content}>
        {userRedux.logged ? (
          <>
            <ProgressButton />
            <ScheduleButton />
            <NutritionButton />
            <WorkoutButton />
            <GalleryButton />
            <ProfilePic />
            <Accordions />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "10vh",
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
