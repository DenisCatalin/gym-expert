import styles from "../../css/components/Burger.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileButton from "../Header/profile/Profile.c";
import FriendList from "../Friends/FriendList.c";
import PersonalMessages from "../PersonalMessages/PersonalMessages.c";
import Notifications from "../Notifications/Notifications.c";
import { useSelector } from "react-redux";
import { autocompleteTheme } from "../../utils/muiTheme";
import Autocomplete from "../../interface/Autocomplete";
import { ThemeProvider } from "@mui/material";
import fetchData from "../../utils/fetchData";
import CloseIcon from "@mui/icons-material/Close";

const links = ["home", "exercises", "pricing", "news", "chat", "about", "contact"];

const Burger = () => {
  const [state, setState] = useState<boolean>(false);
  const [logged, setLogged] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<any[]>([]);

  const userRedux = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (userRedux.logged) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, [userRedux]);

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
          {logged && (
            <div className={styles.buttons}>
              <FriendList />
              <PersonalMessages />
              <Notifications />
            </div>
          )}
          <div className={styles.links}>
            {links.map((item, i) => (
              <Link href={i === 0 ? "/" : `/${item}`} key={i}>
                <h1 className={styles.drawerLink} key={i} onClick={() => setState(false)}>
                  {item}
                </h1>
              </Link>
            ))}
          </div>
          <div className={styles.closeDrawer}>
            <CloseIcon
              htmlColor="var(--pink)"
              onClick={() => setState(false)}
              className={styles.closeIcon}
            />
          </div>
          <ThemeProvider theme={autocompleteTheme}>
            <Autocomplete label={"Search for profile name"} completions={dataSearch} />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default Burger;
