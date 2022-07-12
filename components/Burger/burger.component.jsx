import styles from "../../css/components/Burger.module.css";
import Drawer from "@mui/material/Drawer";
import { useState } from "react";
import ProfileButton from "../Header/profile/profile.component";

const Burger = () => {
  const [state, setState] = useState(false);
  return (
    <>
      <div className={styles.burger} onClick={() => setState(true)}>
        <div className={styles.line1}></div>
        <div className={styles.line2}></div>
        <div className={styles.line3}></div>
      </div>
      <div
        className={styles.blur}
        onClick={() => setState(false)}
        style={{ display: state ? "initial" : "none" }}
      >
        <div className={styles.blurDrawer}></div>
      </div>
      <div
        className={styles.mobileNavbar}
        style={{ left: state ? "50%" : "150%" }}
      >
        <div className={styles.drawer}>
          <div className={styles.drawerAvatar}>
            <ProfileButton />
          </div>
          <h1 className={styles.drawerLink}>home</h1>
          <h1 className={styles.drawerLink}>exercises</h1>
          <h1 className={styles.drawerLink}>pricing</h1>
          <h1 className={styles.drawerLink}>news</h1>
          <h1 className={styles.drawerLink}>about</h1>
          <h1 className={styles.drawerLink}>contact</h1>
        </div>
      </div>
    </>
  );
};

export default Burger;
