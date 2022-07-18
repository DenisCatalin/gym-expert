import React from "react";
import TextField from "@mui/material/TextField";
import Header from "../components/Header/header.component";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import SendIcon from "@mui/icons-material/Send";
import styles from "../css/Contact.module.css";
import useWindowDimensions from "../utils/useWindowDimensions";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";

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

const Contact = () => {
  const { width, height } = useWindowDimensions();
  return (
    <div className={styles.container}>
      <Header />
      {width < height ? (
        <>
          <div className={styles.content}>
            <div className={styles.imageSide}>
              <Image
                src={"/static/contact.jpg"}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className={styles.contentSide}>
              <div className={styles.upperPart}>
                <h1 className={styles.title}>Contact us</h1>
                <h1 className={styles.opacityText}>
                  Do you have any questions about our platform or you simply
                  found a bug? feel free to email us
                </h1>
              </div>
              <div className={styles.midPart}>
                <TextField
                  id="outlined-basic"
                  label="Your email"
                  variant="filled"
                  color="secondary"
                  className={styles.input}
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                />

                <TextField
                  id="outlined-basic"
                  label="Subject"
                  variant="filled"
                  color="secondary"
                  className={styles.input}
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                />

                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder="Your message"
                  variant="filled"
                  style={{ height: "60%" }}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.bottomPart}>
                <ThemeProvider theme={theme2}>
                  <motion.button
                    className={styles.reviewButton}
                    whileHover={{
                      boxShadow: "0px 0px 10px rgba(220, 130, 242, .65)",
                    }}
                    animate={{ x: [-500, 0], opacity: [0, 1] }}
                    initial={{ y: 0 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <h1 className={styles.reviewButtonText}>Send</h1>
                    <SendIcon color="neutral" className={styles.buttonIcon} />
                  </motion.button>
                </ThemeProvider>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.content}></div>
        </>
      )}
    </div>
  );
};

export default Contact;
