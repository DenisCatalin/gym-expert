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
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Felis eget nunc lobortis mattis aliquam. Vel elit scelerisque
                mauris pellentesque pulvinar pellentesque habitant morbi.
                Facilisi cras fermentum odio eu feugiat pretium nibh. Nisi porta
                lorem mollis aliquam ut porttitor leo a. Vulputate mi sit amet
                mauris commodo quis imperdiet. Facilisi nullam vehicula ipsum a
                arcu cursus vitae. Ut aliquam purus sit amet luctus venenatis
                lectus. Ac ut consequat semper viverra nam libero justo. Sit
                amet dictum sit amet justo. Risus pretium quam vulputate
                dignissim suspendisse in. Aliquet porttitor lacus luctus
                accumsan tortor posuere ac ut consequat. Nibh ipsum consequat
                nisl vel pretium. Risus sed vulputate odio ut enim. Egestas diam
                in arcu cursus. Lectus arcu bibendum at varius vel pharetra.
                Eget dolor morbi non arcu risus quis varius quam quisque. Lorem
                ipsum dolor sit amet consectetur adipiscing elit duis tristique.
                Cras ornare arcu dui vivamus. In vitae turpis massa sed
                elementum tempus egestas. Praesent semper feugiat nibh sed
                pulvinar proin gravida. Elementum tempus egestas sed sed risus.
                Id eu nisl nunc mi ipsum. Ultrices sagittis orci a scelerisque
                purus semper eget duis at. Tortor vitae purus faucibus ornare
                suspendisse sed nisi. Leo urna molestie at elementum eu.
                Malesuada fames ac turpis egestas integer eget aliquet nibh
                praesent. Hendrerit gravida rutrum quisque non tellus orci ac
                auctor augue. Nisi porta lorem mollis aliquam ut. Commodo odio
                aenean sed adipiscing. Morbi leo urna molestie at elementum eu
                facilisis. Arcu felis bibendum ut tristique et egestas. Diam
                volutpat commodo sed egestas egestas fringilla phasellus
                faucibus scelerisque. In eu mi bibendum neque egestas congue
                quisque egestas. Nunc lobortis mattis aliquam faucibus purus.
                Aliquam sem et tortor consequat id. Vel elit scelerisque mauris
                pellentesque pulvinar pellentesque habitant morbi. Sit amet
                tellus cras adipiscing enim eu turpis egestas pretium. Aliquet
                nec ullamcorper sit amet risus nullam eget. Feugiat vivamus at
                augue eget arcu dictum varius duis at. Quam quisque id diam vel
                quam. In vitae turpis massa sed elementum tempus egestas sed. At
                risus viverra adipiscing at in tellus integer. Risus in
                hendrerit gravida rutrum quisque non tellus orci. Enim nec dui
                nunc mattis. Eleifend donec pretium vulputate sapien nec
                sagittis. Accumsan tortor posuere ac ut consequat semper viverra
                nam. Tempus imperdiet nulla malesuada pellentesque. Euismod
                lacinia at quis risus sed vulputate odio ut. Nibh mauris cursus
                mattis molestie a iaculis at erat pellentesque. Tristique
                senectus et netus et malesuada fames. Mattis aliquam faucibus
                purus in massa tempor nec feugiat. Ultrices mi tempus imperdiet
                nulla malesuada. Donec pretium vulputate sapien nec sagittis
                aliquam malesuada bibendum. Rhoncus est pellentesque elit
                ullamcorper dignissim cras tincidunt. Integer quis auctor elit
                sed vulputate mi. Auctor eu augue ut lectus arcu bibendum at
                varius vel. Euismod elementum nisi quis eleifend quam adipiscing
                vitae proin sagittis. Cursus in hac habitasse platea dictumst
                quisque sagittis. Ut consequat semper viverra nam libero justo
                laoreet sit amet. Condimentum mattis pellentesque id nibh tortor
                id. Nisi porta lorem mollis aliquam ut. Arcu odio ut sem nulla
                pharetra diam sit amet. Viverra orci sagittis eu volutpat odio
                facilisis. Platea dictumst quisque sagittis purus sit amet
                volutpat consequat. Ornare arcu odio ut sem nulla. Mauris cursus
                mattis molestie a. Tincidunt tortor aliquam nulla facilisi.
                Augue lacus viverra vitae congue. Dignissim diam quis enim
                lobortis scelerisque fermentum dui. Dis parturient montes
                nascetur ridiculus mus mauris vitae ultricies.
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
