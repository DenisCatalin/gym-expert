import TextField from "@mui/material/TextField";
import Header from "../components/Header/header.component";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import SendIcon from "@mui/icons-material/Send";
import styles from "../css/Contact.module.css";
import useWindowDimensions from "../utils/useWindowDimensions";
import { ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import StayPrimaryPortraitIcon from "@mui/icons-material/StayPrimaryPortrait";
import Head from "next/head";
import CustomSnackbar from "../components/Snackbar/snackbar.component";
import { theme2 } from "../utils/muiTheme";
import { useDispatch } from "react-redux";

const Contact = () => {
  const { width, height } = useWindowDimensions();

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Contact</title>
      </Head>
      <Header />
      <CustomSnackbar />
      {height > 550 ? (
        <>
          <motion.div className={styles.content} animate={{ opacity: [0, 1] }}>
            <div className={styles.imageSide}>
              <Image src={"/static/contact.jpg"} alt="" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.contentSide}>
              <div className={styles.upperPart}>
                <h1 className={styles.title}>Contact us</h1>
                <h1 className={styles.opacityText}>
                  Do you have any questions about our platform or you simply found a bug? Feel free
                  to email us
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
                    <h1 className={styles.reviewButtonText} onClick={() => useDispatch(
                      setSnackbar({
                        open: true,
                        content: "Please fill all the fields below",
                      })
                    )}>
                      Send
                    </h1>
                    <SendIcon color="neutral" className={styles.buttonIcon} />
                  </motion.button>
                </ThemeProvider>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          <div className={styles.mobile}>
            <ThemeProvider theme={theme2}>
              <StayPrimaryPortraitIcon color="neutral" style={{ fontSize: "5em" }} />
            </ThemeProvider>
          </div>
        </>
      )
      }
    </div >
  );
};

export default Contact;
