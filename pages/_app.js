import "../css/globals.css";
import { didTokenContext } from "../lib/didTokenContext";
import { userContext } from "../lib/userContext";
import { useState } from "react";
import { cropContext } from "../lib/cropContext";
import { Provider } from "react-redux";
import store from "../redux/store";

function MyApp({ Component, pageProps }) {
  const [didToken, setDidToken] = useState("");
  const [cropImage, setCropImage] = useState({});
  const [user, setUser] = useState({
    secretKeyword: null,
    profileAvatar: "",
    cropped: false,
  });

  return (
    <userContext.Provider value={{ user, setUser }}>
      <didTokenContext.Provider value={{ didToken, setDidToken }}>
        <cropContext.Provider value={{ cropImage, setCropImage }}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </cropContext.Provider>
      </didTokenContext.Provider>
    </userContext.Provider>
  );
}

export default MyApp;
