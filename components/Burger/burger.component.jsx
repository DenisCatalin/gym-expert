import styles from "../../css/components/Burger.module.css";
import Link from "next/link";
import { useState } from "react";
import ProfileButton from "../Header/profile/profile.component";

const links = ["home", "exercises", "pricing", "news", "about", "contact"];

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
          {links.map((item, i) => (
            <Link href={i === 0 ? "/" : `/${item}`} key={i}>
              <a>
                <h1 className={styles.drawerLink} key={i}>
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
