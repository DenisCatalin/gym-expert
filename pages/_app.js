import "../css/globals.css";
import { didTokenContext } from "../lib/didTokenContext";
import { userContext } from "../lib/userContext";
import { useState } from "react";
import { dialogContext } from "../lib/dialogContext";
import { cropContext } from "../lib/cropContext";
import { testimonialContext } from "../lib/testimonialContext";
import { snackbarContext } from "../lib/snackbarContext";
import { reviewContext } from "../lib/reviewContext";
import { exerciseContext } from "../lib/exerciseContext";
import { Provider } from "react-redux";
import store from "../redux/store";

function MyApp({ Component, pageProps }) {
  const [didToken, setDidToken] = useState("");
  const [dialogAlert, setDialogAlert] = useState(false);
  const [cropImage, setCropImage] = useState({});
  const [testimonialss, setTestimonialss] = useState(false);
  const [review, setReview] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState("");
  const [updateExercises, setUpdateExercises] = useState(false);
  const [user, setUser] = useState({
    secretKeyword: null,
    profileAvatar: "",
    cropped: false,
  });

  return (
    <userContext.Provider value={{ user, setUser }}>
      <didTokenContext.Provider value={{ didToken, setDidToken }}>
        <dialogContext.Provider value={{ dialogAlert, setDialogAlert }}>
          <cropContext.Provider value={{ cropImage, setCropImage }}>
            <testimonialContext.Provider value={{ testimonialss, setTestimonialss }}>
              <snackbarContext.Provider value={{ snackbarContent, setSnackbarContent }}>
                <reviewContext.Provider value={{ review, setReview }}>
                  <exerciseContext.Provider value={{ updateExercises, setUpdateExercises }}>
                    <Provider store={store}>
                      <Component {...pageProps} />
                    </Provider>
                  </exerciseContext.Provider>
                </reviewContext.Provider>
              </snackbarContext.Provider>
            </testimonialContext.Provider>
          </cropContext.Provider>
        </dialogContext.Provider>
      </didTokenContext.Provider>
    </userContext.Provider>
  );
}

export default MyApp;
