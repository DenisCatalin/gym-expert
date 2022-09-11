import Avatar from "@mui/material/Avatar";
import styles from "../../../css/components/ProfileButton.module.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { didTokenContext } from "../../../lib/didTokenContext";
import { magic } from "../../../lib/magic-client";
import CircularProgress from "@mui/material/CircularProgress";
import { userContext } from "../../../lib/userContext";
import Link from "next/link";
import { theme2 } from "../../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { cropImages } from "../../../lib/cropImages";
import Image from "next/image";
import { snackbarContext } from "../../../lib/snackbarContext";
import { useSelector, useDispatch } from "react-redux";
import {
  setDisplayNameRedux,
  setProfilePicRedux,
  setCropAreaRedux,
  setAdminRedux,
  setTestimonialRedux,
  setEmailRedux,
  setPaidPlanRedux,
  setPlanExpireDateRedux,
  setMagicTokenRedux,
  setIssuerRedux,
  setMemberSinceRedux,
  setSubscribedSinceRedux,
  setSecretKeywordRedux,
  setLoggedRedux,
  setProfileAvatarRedux,
  setFavouritesRedux,
} from "../../../redux/user.slice";

const ProfileButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const { didToken, setDidToken } = useContext(didTokenContext);
  const isMounted = useRef(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState();
  const [profilePic, setProfilePic] = useState();
  const { user, setUser } = useContext(userContext);
  const { snackbarContent, setSnackbarContent } = useContext(snackbarContext);

  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user);

  function dispatchFromLocalStorage() {
    dispatch(setDisplayNameRedux(localStorage.getItem("displayName")));
    dispatch(setSecretKeywordRedux(localStorage.getItem("secretKeyword")));
    dispatch(setProfilePicRedux(localStorage.getItem("profilePic")));
    dispatch(setCropAreaRedux(JSON.parse(localStorage.getItem("cropArea"))));
    dispatch(setAdminRedux(JSON.parse(localStorage.getItem("admin"))));
    dispatch(
      setTestimonialRedux(JSON.parse(localStorage.getItem("testimonial")))
    );
    dispatch(setEmailRedux(localStorage.getItem("email")));
    dispatch(setPaidPlanRedux(localStorage.getItem("paidPlan")));
    dispatch(
      setPlanExpireDateRedux(JSON.parse(localStorage.getItem("planExpireDate")))
    );
    dispatch(setMagicTokenRedux(didToken));
    dispatch(setIssuerRedux(localStorage.getItem("issuer")));
    dispatch(setMemberSinceRedux(localStorage.getItem("memberSince")));
    dispatch(setSubscribedSinceRedux(localStorage.getItem("subscribedSince")));
    dispatch(setLoggedRedux(true));
    dispatch(setProfileAvatarRedux(localStorage.getItem("profileAvatar")));
    dispatch(setFavouritesRedux(localStorage.getItem("favourites")));
  }

  function dispatchFromFetch(data) {
    localStorage.setItem("logged", true);
    localStorage.setItem(
      "displayName",
      data?.userDetails?.data?.users[0].displayName
    );
    localStorage.setItem(
      "secretKeyword",
      data?.userDetails?.data?.users[0].secretKeyword
    );
    localStorage.setItem(
      "profilePic",
      data?.userDetails?.data?.users[0].profilePic
    );
    localStorage.setItem(
      "cropArea",
      data?.userDetails?.data?.users[0].cropArea
    );

    localStorage.setItem("admin", data?.userDetails?.data?.users[0].admin);
    localStorage.setItem(
      "testimonial",
      data?.userDetails?.data?.users[0].testimonial
    );
    localStorage.setItem("email", data?.userDetails?.data?.users[0].email);
    localStorage.setItem(
      "paidPlan",
      data?.userDetails?.data?.users[0].paidPlan
    );
    localStorage.setItem(
      "planExpireDate",
      data?.userDetails?.data?.users[0].planExpireDate
    );
    localStorage.setItem(
      "memberSince",
      data?.userDetails?.data?.users[0].registerDate
    );
    localStorage.setItem(
      "subscribedSince",
      data?.userDetails?.data?.users[0].subscribedIn
    );
    localStorage.setItem(
      "profileAvatar",
      data?.userDetails?.data?.users[0].profilePic
    );
    localStorage.setItem(
      "favourites",
      data?.userDetails?.data?.users[0].favouriteExercises
    );

    localStorage.setItem("issuer", data?.userDetails?.data?.users[0].issuer);

    dispatch(
      setDisplayNameRedux(data?.userDetails?.data?.users[0].displayName)
    );
    dispatch(setProfilePicRedux(data?.userDetails?.data?.users[0].profilePic));
    dispatch(setCropAreaRedux(data?.userDetails?.data?.users[0].cropArea));
    dispatch(setAdminRedux(data?.userDetails?.data?.users[0].admin));
    dispatch(
      setTestimonialRedux(data?.userDetails?.data?.users[0].testimonial)
    );
    dispatch(setEmailRedux(data?.userDetails?.data?.users[0].email));
    dispatch(setPaidPlanRedux(data?.userDetails?.data?.users[0].paidPlan));
    dispatch(
      setPlanExpireDateRedux(data?.userDetails?.data?.users[0].planExpireDate)
    );
    dispatch(setMagicTokenRedux(didToken));
    dispatch(setIssuerRedux(data?.userDetails?.data?.users[0].issuer));
    dispatch(
      setMemberSinceRedux(data?.userDetails?.data?.users[0].registerDate)
    );
    dispatch(
      setSubscribedSinceRedux(data?.userDetails?.data?.users[0].subscribedIn)
    );
    dispatch(
      setSecretKeywordRedux(data?.userDetails?.data?.users[0].secretKeyword)
    );
    dispatch(setLoggedRedux(true));
    dispatch(
      setProfileAvatarRedux(data?.userDetails?.data?.users[0].profilePic)
    );
    dispatch(
      setFavouritesRedux(data?.userDetails?.data?.users[0].favouriteExercises)
    );
  }

  async function checkPlan() {
    if (userRedux.paidPlan !== null && userRedux.planExpireDate !== 0) {
      const dateNow = Math.floor(Date.now() / 1000);
      if (dateNow > userRedux.planExpireDate) {
        userRedux.paidPlan = null;
        userRedux.planExpireDate = 0;
        setSnackbarContent(
          "Your subscription on our platform has expired. You can renew it by visiting the pricing page."
        );
        const res2 = await fetch("/api/updateSubscription", {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
              planExpireDate: userRedux.planExpireDate,
              paidPlan: userRedux.paidPlan,
              subscribedIn: 0,
            }),
          },
        });
        const data2 = await res2.json();
        console.log(data2);
      }
    }
  }

  const cropPhoto = async () => {
    if (
      userRedux.profilePic !== "" &&
      userRedux.logged &&
      userRedux.cropped === false &&
      userRedux.cropArea !== null
    ) {
      user.cropped = true;
      const img = await cropImages(userRedux.profilePic, userRedux.cropArea);
      dispatch(setProfilePicRedux(img));
    }
  };

  console.log("redux", userRedux);

  useEffect(() => {
    (async () => {
      if (!userRedux.logged) {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          if (JSON.parse(localStorage.getItem("logged")) === true) {
            setProfilePic(localStorage.getItem("profilePic"));
            setDisplayName(localStorage.getItem("displayName"));
            dispatchFromLocalStorage();
          } else {
            try {
              const { email } = await magic.user.getMetadata();
              if (email) {
                const didToken = await magic.user.getIdToken();

                const res = await fetch("/api/userDetails");
                const data = await res.json();

                if (isMounted.current) {
                  setProfilePic(data?.userDetails?.data?.users[0].profilePic);
                  setDisplayName(data?.userDetails?.data?.users[0].displayName);

                  dispatchFromFetch(data);

                  setUserDetails(data);

                  await checkPlan();
                  setLoggedIn(true);
                  setDidToken(didToken);
                  cropPhoto();
                }
              }
            } catch (error) {
              console.error("Can't retrieve email in NavBar", error);
            }
          }
        }
      } else {
        setDisplayName(userRedux.displayName);
        setLoggedIn(userRedux.logged);
        setProfilePic(userRedux.profilePic);
      }

      setIsLoading(false);
    })();

    return () => {
      isMounted.current = false;
    };
  }, [profilePic]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async (e) => {
    e.preventDefault();

    dispatch(setDisplayNameRedux(""));
    dispatch(setProfilePicRedux(""));
    dispatch(setAdminRedux(0));
    dispatch(setTestimonialRedux(""));
    dispatch(setEmailRedux(""));
    dispatch(setMagicTokenRedux(""));
    dispatch(setLoggedRedux(false));

    localStorage.removeItem("logged");

    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <CircularProgress color="secondary" />
        </>
      ) : (
        <>
          {loggedIn ? (
            <>
              <Avatar className={styles.avatar} onClick={handleClick}>
                {userRedux.profilePic === null ? (
                  displayName[0]
                ) : (
                  <Image
                    src={userRedux.profilePic}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  />
                )}
              </Avatar>
            </>
          ) : (
            <Link href={"/login"}>
              <a>
                <h2>Sign In</h2>
              </a>
            </Link>
          )}
        </>
      )}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            color: "white",
            cursor: "pointer",
            background: "linear-gradient(334.52deg, #E87BFF 0%, #622CCE 100%)",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <ThemeProvider theme={theme2}>
          <MenuItem onClick={() => router.push("/profile")}>
            <ListItemIcon>
              <ManageAccountsIcon fontSize="small" color="pink" />
            </ListItemIcon>{" "}
            Profile Dashboard
          </MenuItem>
          <Divider />
          {userRedux.admin === 1 ? (
            <MenuItem onClick={() => router.push("/adminPage")}>
              <ListItemIcon>
                <Settings fontSize="small" color="pink" />
              </ListItemIcon>
              Admin Page
            </MenuItem>
          ) : null}
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <Logout fontSize="small" color="pink" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </ThemeProvider>
      </Menu>
    </>
  );
};

export default ProfileButton;
