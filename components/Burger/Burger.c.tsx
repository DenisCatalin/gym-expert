import styles from "../../css/components/Burger.module.css";
import Link from "next/link";
import { useState } from "react";
import ProfileButton from "../Header/profile/Profile.c";
import FriendList from "../Friends/FriendList.c";
import PersonalMessages from "../PersonalMessages/PersonalMessages.c";
import Notifications from "../Notifications/Notifications.c";

const links = ["home", "exercises", "pricing", "news", "chat", "about", "contact"];

const Burger = () => {
  const [state, setState] = useState<boolean>(false);

  return (
    <>
      <div
        className={styles.burger}
        onClick={() => {
          setState(true);
        }}
      >
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
        style={{
          opacity: state ? "1" : "0",
          pointerEvents: state ? "all" : "none",
        }}
      >
        <div className={styles.drawer}>
          <div className={styles.drawerAvatar}>
            <ProfileButton />
          </div>
          <FriendList />
          <PersonalMessages />
          <Notifications />
          {links.map((item, i) => (
            <Link href={i === 0 ? "/" : `/${item}`} key={i}>
              <a>
                <h1 className={styles.drawerLink} key={i} onClick={() => setState(false)}>
                  {item}
                </h1>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Burger;
