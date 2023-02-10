import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../css/Login.module.css";
import Header from "../components/Header/Header.c";
import { ThemeProvider } from "@mui/material";
import { theme2 } from "../utils/muiTheme";
import { MotionButton } from "../interface/MotionButton";
import fetchData from "../utils/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { setUserState } from "../redux/user.slice";
import { useRouter } from "next/router";
import { ROUTES } from "../Routes";

const ForgotKeyword = () => {
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<any>(null);
  const userMsgRef = useRef<any>(null);

  const userRedux = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLoginWithEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!userRedux.logged) return;
    const res = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_FORGOT_KEYWORD}`, {
      method: "POST",
      headers: {
        body: JSON.stringify({
          email: inputRef?.current?.value,
        }),
      },
    });

    if (res.forgotKeywordForUser.data.users.length !== 0) {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_KEYWORD_NULL}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
          }),
        },
      });

      dispatch(
        setUserState({
          ...userRedux,
          secretKeyword: null,
        })
      );

      router.push(ROUTES.homepage);
    }
    setUserMsg("Your secret keyword has been resetted.");
    setIsLoading(false);
  };

  useEffect(() => {
    if (userMsg.length > 0) {
      userMsgRef?.current?.focus();
    }
  }, [userMsg]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Forgot Keyword</title>
      </Head>
      <div className={styles.content}>
        <div className={styles.loginContainer}>
          <div className={styles.text}>
            <h1 className={styles.title} tabIndex={0}>
              Reset Secret Keyword
            </h1>
            <h2 className={styles.opacityText} tabIndex={0}>
              In order to be able to reset your secret keyword, you need to provide the email
              address for your account.
            </h2>
          </div>
          <div className={styles.inputField}>
            <input type="email" ref={inputRef} className={styles.input} />
          </div>
          {userMsg !== "" ? (
            <p className={styles.userMsg} ref={userMsgRef}>
              {userMsg}
            </p>
          ) : null}
          <div className={styles.login}>
            <ThemeProvider theme={theme2}>
              <MotionButton
                hover={"boxShadow"}
                tap
                animateOptions={{ x: [-500, 0], opacity: [0, 1] }}
                initialOptions={{ y: 0 }}
                className={styles.loginButton}
                onClick={handleLoginWithEmail}
                style={{ pointerEvents: isLoading ? "none" : "all" }}
                disabled={isLoading ? true : false}
                label={
                  <>
                    {isLoading ? (
                      <h1 className={styles.loginButtonText}>Loading...</h1>
                    ) : (
                      <h1 className={styles.loginButtonText}>Reset</h1>
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

export default ForgotKeyword;
