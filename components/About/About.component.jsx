import React from "react";
import styles from "../../css/components/About.module.css";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const theme2 = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#434343",
      darker: "#434343",
    },
    neutral: {
      main: "#EEE",
      contrastText: "#EEE",
    },
    dark: {
      main: "#434343",
      contrastText: "#434343",
    },
  },
});

const AboutContainer = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <motion.div className={styles.content} animate={{ scale: [0, 1] }}>
        <div className={styles.imageAbout}></div>
        <div className={styles.textSide}>
          <h1 className={styles.aboutTitle}>About us</h1>
          <div className={styles.aboutTextContainer}>
            <div className={styles.aboutTextContent}>
              <h1>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis
                tristique sollicitudin nibh sit amet commodo nulla facilisi
                nullam. Natoque penatibus et magnis dis. Quis risus sed
                vulputate odio ut enim blandit. Lacus sed viverra tellus in.
                Vitae congue eu consequat ac felis. Velit ut tortor pretium
                viverra. Lobortis elementum nibh tellus molestie nunc non
                blandit. Donec et odio pellentesque diam volutpat commodo sed.
                Nunc sed blandit libero volutpat sed. Arcu risus quis varius
                quam quisque id diam vel. Velit laoreet id donec ultrices
                tincidunt arcu non. Consectetur purus ut faucibus pulvinar
                elementum integer. Sit amet dictum sit amet justo. Sed libero
                enim sed faucibus turpis in. Sagittis nisl rhoncus mattis
                rhoncus urna. Maecenas sed enim ut sem viverra. Id consectetur
                purus ut faucibus pulvinar elementum integer enim neque. Ante in
                nibh mauris cursus mattis molestie a iaculis at. Fermentum
                posuere urna nec tincidunt. Mauris vitae ultricies leo integer
                malesuada nunc vel. Pellentesque dignissim enim sit amet.
                Ultrices dui sapien eget mi proin sed. Id neque aliquam
                vestibulum morbi blandit cursus risus at ultrices. Auctor urna
                nunc id cursus. Semper eget duis at tellus at urna. Potenti
                nullam ac tortor vitae. Cras sed felis eget velit aliquet
                sagittis id consectetur. Tristique et egestas quis ipsum
                suspendisse ultrices. Platea dictumst quisque sagittis purus sit
                amet volutpat consequat. Massa ultricies mi quis hendrerit dolor
                magna eget. Quam viverra orci sagittis eu. Arcu non odio euismod
                lacinia at. Ac orci phasellus egestas tellus rutrum tellus. Arcu
                vitae elementum curabitur vitae. Turpis egestas integer eget
                aliquet nibh. Sed risus ultricies tristique nulla. Cursus sit
                amet dictum sit amet justo donec enim diam. A condimentum vitae
                sapien pellentesque. Facilisi morbi tempus iaculis urna. Laoreet
                non curabitur gravida arcu. Vulputate eu scelerisque felis
                imperdiet proin fermentum leo vel orci. Mauris cursus mattis
                molestie a. Egestas integer eget aliquet nibh praesent tristique
                magna sit. Eu consequat ac felis donec et odio pellentesque
                diam. Nam libero justo laoreet sit amet cursus sit amet. Lacinia
                at quis risus sed vulputate odio. Volutpat ac tincidunt vitae
                semper quis lectus. Neque aliquam vestibulum morbi blandit
                cursus risus at. Et malesuada fames ac turpis. Convallis posuere
                morbi leo urna molestie at elementum eu. Enim nunc faucibus a
                pellentesque sit amet porttitor eget dolor. Eros in cursus
                turpis massa tincidunt dui. Amet consectetur adipiscing elit ut
                aliquam purus sit amet. Convallis posuere morbi leo urna
                molestie at elementum eu facilisis. Etiam sit amet nisl purus in
                mollis. Venenatis a condimentum vitae sapien pellentesque. Neque
                ornare aenean euismod elementum nisi quis eleifend quam. Velit
                egestas dui id ornare arcu odio ut sem nulla. Nulla malesuada
                pellentesque elit eget gravida cum sociis. At in tellus integer
                feugiat scelerisque varius morbi enim. Aliquet enim tortor at
                auctor. Arcu cursus euismod quis viverra nibh cras.
              </h1>
            </div>
          </div>
        </div>
      </motion.div>
      <ThemeProvider theme={theme2}>
        <motion.button
          className={styles.ourTeamButton}
          whileHover={{
            boxShadow: "0px 0px 10px rgba(220, 130, 242, .65)",
          }}
          animate={{ y: [200, 0] }}
          initial={{ y: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("#team")}
        >
          <h1 className={styles.teamButtonText}>Our Team</h1>
          <KeyboardDoubleArrowDownIcon
            color="neutral"
            className={styles.teamButtonIcon}
          />
        </motion.button>
      </ThemeProvider>
    </div>
  );
};

export default AboutContainer;
