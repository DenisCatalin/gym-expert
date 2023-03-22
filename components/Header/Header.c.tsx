import styles from "../../css/components/Header.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProfileButton from "./profile/Profile.c";
import { motion } from "framer-motion";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Burger from "../Burger/Burger.c";
import { ROUTES } from "../../Routes";
import Notifications from "../Notifications/Notifications.c";
import FriendList from "../Friends/FriendList.c";
import fetchData from "../../utils/fetchData";
import PersonalMessages from "../PersonalMessages/PersonalMessages.c";
import { useSelector } from "react-redux";

const links = ["home", "exercises", "pricing", "news", "chat", "about", "contact"];

const Header = ({ sticky = false }) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const userRedux = useSelector((state: any) => state.user.user);

  const [logged, setLogged] = useState<boolean>(false);
  const [mounted, setMounted] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (userRedux.logged) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, [userRedux]);

  useEffect(() => {
    setMounted(
      <>
        {width > 910 ? (
          <>
            <motion.div
              className={styles.navbarContainer}
              animate={{ x: [-1000, 0], opacity: [0, 1] }}
              initial={{ x: -1000, opacity: 0 }}
            >
              <ul className={styles.navbar} aria-label="navigation bar">
                {links.map((item, i) => (
                  <Link href={i === 0 ? "/" : `${item}`} key={i}>
                    <a>
                      <li role="link" className={styles.link} key={i}>
                        {item}
                      </li>
                    </a>
                  </Link>
                ))}

                {logged && (
                  <>
                    <FriendList />
                    <PersonalMessages />
                    <Notifications />
                  </>
                )}

                <ProfileButton />
              </ul>
            </motion.div>
          </>
        ) : (
          <Burger />
        )}
      </>
    );
  }, [width, logged]);

  return (
    <motion.div
      className={styles.container}
      animate={{ opacity: [0, 1] }}
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      style={{
        position: sticky ? "fixed" : "initial",
        backdropFilter: sticky ? "blur(10px)" : "none",
      }}
    >
      <div className={styles.logoContainer} onClick={() => router.push(ROUTES.homepage)}>
        <div className={styles.logo}>
          <Image src={"/static/logo-gym.png"} alt="" layout="fill" />
        </div>
        <h1
          role="link"
          tabIndex={0}
          className={styles.logoName}
          onKeyDown={event => event.code === "Enter" && router.push(ROUTES.homepage)}
        >
          GYM EXPERT
        </h1>
      </div>
      {mounted}
    </motion.div>
  );
};

export default Header;
