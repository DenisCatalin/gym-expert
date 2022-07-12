import styles from "../../css/components/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileButton from "./profile/profile.component";
import { motion } from "framer-motion";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Burger from "../Burger/burger.component";

const links = ["home", "exercises", "pricing", "news", "about", "contact"];

const Header = () => {
  const { width } = useWindowDimensions();

  const [mounted, setMounted] = useState(null);

  useEffect(() => {
    setMounted(
      <>
        {width > 820 ? (
          <>
            <motion.div
              className={styles.navbarContainer}
              animate={{ x: [500, 0] }}
              initial={{ x: 500 }}
            >
              <ul className={styles.navbar}>
                {links.map((item, i) => (
                  <Link href={i === 0 ? "/" : `${item}`}>
                    <a>
                      <li className={styles.link} key={i}>
                        {item}
                      </li>
                    </a>
                  </Link>
                ))}
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
    >
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <Image src={"/static/logo-gym.png"} alt="" layout="fill" />
        </div>
        <h1 className={styles.logoName}>GYM EXPERT</h1>
      </div>
      {mounted}
    </motion.div>
  );
};

export default Header;
