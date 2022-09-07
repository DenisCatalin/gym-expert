import "../css/globals.css";
import { didTokenContext } from "../lib/didTokenContext";
import { userContext } from "../lib/userContext";
import { useState } from "react";
import { dialogContext } from "../lib/dialogContext";
import { purchaseContext } from "../lib/purchaseContext";
import { cropContext } from "../lib/cropContext";
import { testimonialContext } from "../lib/testimonialContext";
import { snackbarContext } from "../lib/snackbarContext";
import { reviewContext } from "../lib/reviewContext";
<<<<<<< HEAD
import { Provider } from "react-redux";
import store  from '../lib/redux/store';
=======
import { exerciseContext } from "../lib/exerciseContext";
>>>>>>> 8e3c1478193065d5df74ae9d18d635c435901d41

function MyApp({ Component, pageProps }) {
  const [didToken, setDidToken] = useState("");
  const [dialogAlert, setDialogAlert] = useState(false);
  const [cropImage, setCropImage] = useState({});
  const [testimonialss, setTestimonialss] = useState(false);
  const [review, setReview] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState("");
  const [updateExercises, setUpdateExercises] = useState(false);
  const [subscription, setSubscription] = useState({
    price: 0,
    plan: "",
  });
  const [user, setUser] = useState({
    displayName: "",
    profilePic: "",
    cropArea: null,
    admin: 0,
    testimonial: 0,
    email: "",
    magicToken: "",
    paidPlan: null,
    planExpireDate: 0,
    issuer: "",
    memberSince: "",
    subscribedSince: 0,
    secretKeyword: null,
    logged: false,
    profileAvatar: "",
    cropped: false,
  });

  return (
    <userContext.Provider value={{ user, setUser }}>
      <didTokenContext.Provider value={{ didToken, setDidToken }}>
        <dialogContext.Provider value={{ dialogAlert, setDialogAlert }}>
          <purchaseContext.Provider value={{ subscription, setSubscription }}>
            <cropContext.Provider value={{ cropImage, setCropImage }}>
              <testimonialContext.Provider
                value={{ testimonialss, setTestimonialss }}
              >
                <snackbarContext.Provider
                  value={{ snackbarContent, setSnackbarContent }}
                >
                  <reviewContext.Provider value={{ review, setReview }}>
<<<<<<< HEAD
                    <Provider store={store}>
                      <Component {...pageProps} />
                    </Provider>
=======
                    <exerciseContext.Provider
                      value={{ updateExercises, setUpdateExercises }}
                    >
                      <Component {...pageProps} />
                    </exerciseContext.Provider>
>>>>>>> 8e3c1478193065d5df74ae9d18d635c435901d41
                  </reviewContext.Provider>
                </snackbarContext.Provider>
              </testimonialContext.Provider>
            </cropContext.Provider>
          </purchaseContext.Provider>
        </dialogContext.Provider>
      </didTokenContext.Provider>
    </userContext.Provider>
  );
}

export default MyApp;
