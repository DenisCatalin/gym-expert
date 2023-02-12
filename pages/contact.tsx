import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import SendIcon from "@mui/icons-material/Send";
import styles from "../css/Contact.module.css";
import useWindowDimensions from "../utils/useWindowDimensions";
import { ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import StayPrimaryPortraitIcon from "@mui/icons-material/StayPrimaryPortrait";
import Head from "next/head";
import { theme2 } from "../utils/muiTheme";
import { useDispatch } from "react-redux";
import { MotionButton } from "../interface/MotionButton";
import { setSnackbar } from "../redux/snackbar.slice";

const Contact = () => {
  const { width, height } = useWindowDimensions();

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      setSnackbar({
        open: true,
        content: "Please fill all the fields below.",
      })
    );
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Contact</title>
      </Head>
      {height > 550 ? (
        <>
          <motion.div className={styles.content} animate={{ opacity: [0, 1] }}>
            <div className={styles.imageSide}>
              <Image src={"/static/contact.jpg"} alt="" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.contentSide}>
              <div className={styles.upperPart}>
                <h1 className={styles.title} tabIndex={0}>
                  Contact us
                </h1>
                <h1 className={styles.opacityText} tabIndex={0}>
                  Do you have any questions about our platform or you simply found a bug? Feel free
                  to email us
                </h1>
              </div>
              <div className={styles.midPart}>
                <TextField
                  id="email"
                  label="Your email"
                  variant="filled"
                  color="secondary"
                  className={styles.input}
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                />

                <TextField
                  id="subject"
                  label="Subject"
                  variant="filled"
                  color="secondary"
                  className={styles.input}
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                />

                <TextareaAutosize
                  aria-label="Your message"
                  placeholder="Your message"
                  style={{ height: "60%" }}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.bottomPart}>
                <ThemeProvider theme={theme2}>
                  <MotionButton
                    hover={"boxShadow"}
                    tap
                    animateOptions={{ x: [-500, 0], opacity: [0, 1] }}
                    initialOptions={{ y: 0 }}
                    className={styles.reviewButton}
                    label={
                      <>
                        <h1 className={styles.reviewButtonText} onClick={handleClick}>
                          Send
                        </h1>
                        <SendIcon htmlColor="#fff" className={styles.buttonIcon} />
                      </>
                    }
                  />
                </ThemeProvider>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          <div className={styles.mobile}>
            <ThemeProvider theme={theme2}>
              <StayPrimaryPortraitIcon htmlColor="#fff" style={{ fontSize: "5em" }} />
            </ThemeProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default Contact;
