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
import Autocomplete from "../../interface/Autocomplete";
import { ThemeProvider } from "@mui/material";
import { autocompleteTheme } from "../../utils/muiTheme";
import fetchData from "../../utils/fetchData";
import PersonalMessages from "../PersonalMessages/PersonalMessages.c";

const links = ["home", "exercises", "pricing", "news", "chat", "about", "contact"];

const Header = ({ sticky = false }) => {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const [mounted, setMounted] = useState<React.ReactNode | null>(null);
  const [dataSearch, setDataSearch] = useState<any[]>([]);

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
                <FriendList />
                <PersonalMessages />
                <Notifications />
                <ProfileButton />
              </ul>
            </motion.div>
          </>
        ) : (
          <Burger />
        )}
      </>
    );
  }, [width]);

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
      <ThemeProvider theme={autocompleteTheme}>
        <Autocomplete label={"Search for profile name"} completions={dataSearch} />
      </ThemeProvider>
      {mounted}
    </motion.div>
  );
};

export default Header;
