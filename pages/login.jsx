import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { magic } from "../lib/magic-client";
import Header from "../components/Header/header.component";
import styles from "../css/Login.module.css";
import { ThemeProvider } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";
import { didTokenContext } from "../lib/didTokenContext";
import { theme2 } from "../utils/muiTheme";
import Head from "next/head";
import { ROUTES } from "../Routes";
import { setUserState } from "../redux/user.slice";
import { useSelector, useDispatch } from "react-redux";
import { MotionButton } from "../interface/MotionButton.tsx";

const Login = () => {
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { didToken, setDidToken } = useContext(didTokenContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const userRedux = useSelector(state => state.user.user);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeComplete", handleComplete);
    };
  }, [router]);

  const handleLoginWithEmail = async e => {
    e.preventDefault();
    if (email) {
      if (email.includes("@") && email.includes(".com")) {
        setUserMsg("Waiting for magic link...");

        try {
          setIsLoading(true);
          const Token = await magic.auth.loginWithMagicLink({
            email,
          });
          if (Token) {
            setDidToken(Token);
            const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_LOGIN}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${Token}`,
                "Content-type": "application/json",
              },
            });
            const loggedInResponse = await res.json();
            if (loggedInResponse.done) {
              router.push(ROUTES.homepage);
              dispatch(setUserState({ ...userRedux, needsUpdate: true }));
            } else {
              console.error("Something went wrong");
            }
          }
        } catch (error) {
          console.error("Something went wrong", error);
          setIsLoading(false);
        }
      } else {
        setUserMsg("Something went wrong");
        setIsLoading(false);
      }
    } else {
      setUserMsg("Enter a valid email address");
      setIsLoading(false);
    }
  };

  const handleOnChangeEmail = e => {
    setEmail(e.target.value);
    setUserMsg("");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Login</title>
      </Head>
      <Header />
      <div className={styles.content}>
        <div className={styles.loginContainer}>
          <div className={styles.text}>
            <h1 className={styles.title}>Login</h1>
            <h2 className={styles.opacityText}>
              In order to be able to explore our platform, you need to be signed in. Enter your
              email in the field below.
            </h2>
          </div>
          <div className={styles.inputField}>
            <input type="email" className={styles.input} onChange={handleOnChangeEmail} />
          </div>
          {userMsg !== "" ? <p className={styles.userMsg}>{userMsg}</p> : null}
          <div className={styles.login}>
            <ThemeProvider theme={theme2}>
              <MotionButton
                hover={"boxShadow"}
                tap
                animateOptions={{ x: [-500, 0], opacity: [0, 1] }}
                initialOptions={{ y: 0 }}
                className={styles.loginButton}
                onClick={handleLoginWithEmail}
                styles={{ pointerEvents: isLoading ? "none" : "all" }}
                label={
                  <>
                    {isLoading ? (
                      <>
                        <h1 className={styles.loginButtonText}>Loading...</h1>
                      </>
                    ) : (
                      <>
                        <h1 className={styles.loginButtonText}>Sign In</h1>
                        <LoginIcon color="neutral" className={styles.buttonIcon} />
                      </>
                    )}
                  </>
                }
              />
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
