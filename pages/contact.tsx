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
import { useDispatch, useSelector } from "react-redux";
import { MotionButton } from "../interface/MotionButton";
import { useRef, useEffect } from "react";
import { setSnackbar } from "../redux/snackbar.slice";
import fetchData from "../utils/fetchData";

const Contact = () => {
  const { width, height } = useWindowDimensions();
  const email = useRef<any>("");
  const subject = useRef<any>("");
  const message = useRef<any>("");

  const userRedux = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (userRedux.logged) {
      email.current = userRedux.email;
    } else {
      email.current = "";
    }
  }, []);

  const dispatch = useDispatch();

  const handleClick = async () => {
    if (email.current !== "" && subject.current !== "" && message.current !== "") {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_SEND_MAIL}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            type: "contact",
            email: email.current,
            subject: subject.current,
            message: `
              <div
                style="background: #140630; border-radius: 20px; color: #DC82F2; padding: 1rem; font-family: 'Kodchasan', sans-serif;">
                <div style="display: flex; justify-content: center; align-items: center;">
                  <img src="https://res.cloudinary.com/dgkdpysp5/image/upload/v1682434325/logo-gym_k9lpki.png"
                    style="width: 50px; height: 50px;" alt="Logo" />
                  <h2 style="color: #DC82F2;">GYM-EXPERT</h2>
                </div>
                <h4 style="font-weight: 100;">${email.current}</h4>
                \r\n
                From: deniscotecata@gmail.com
              </div>
            `,
          }),
        },
      });
    } else {
      dispatch(
        setSnackbar({
          open: true,
          content: "Please fill all the fields below.",
        })
      );
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Contact</title>
      </Head>
      {height > 350 ? (
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
                  onChange={(e: any) => (email.current = e.target.value)}
                />

                <TextField
                  id="subject"
                  label="Subject"
                  variant="filled"
                  color="secondary"
                  className={styles.input}
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                  onChange={(e: any) => (subject.current = e.target.value)}
                />

                <TextareaAutosize
                  aria-label="Your message"
                  placeholder="Your message"
                  style={{ height: "60%" }}
                  className={styles.textarea}
                  onChange={(e: any) => (message.current = e.target.value)}
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
