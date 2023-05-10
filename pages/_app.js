import "../css/globals.css";
import { didTokenContext } from "../lib/didTokenContext";
import { useState } from "react";
import { cropContext } from "../lib/cropContext";
import { Provider } from "react-redux";
import store from "../redux/store";
import Header from "../components/Header/Header.c";
import { useRouter } from "next/router";
import CustomSnackbar from "../components/Snackbar/Snackbar.c";
import MusicPlayerButton from "../components/MusicPlayer/MusicPlayerButton.c";

function MyApp({ Component, pageProps }) {
  const [didToken, setDidToken] = useState("");
  const [cropImage, setCropImage] = useState({});

  const router = useRouter();

  return (
    <didTokenContext.Provider value={{ didToken, setDidToken }}>
      <cropContext.Provider value={{ cropImage, setCropImage }}>
        <Provider store={store}>
          <Header sticky={router.pathname === "/about" ? true : false} />
          <Component {...pageProps} />
          <MusicPlayerButton />
          <CustomSnackbar />
        </Provider>
      </cropContext.Provider>
    </didTokenContext.Provider>
  );
}

export default MyApp;
