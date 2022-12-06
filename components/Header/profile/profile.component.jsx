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
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../../redux/user.slice";
import { setSnackbar } from "../../../redux/snackbar.slice";

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

  const dispatch = useDispatch();
  const userRedux = useSelector(state => state.user.user);

  function dispatchFromLocalStorage() {
    dispatch(
      setUserState({
        ...userRedux,
        displayName: localStorage.getItem("displayName"),
        profilePic: localStorage.getItem("profilePic"),
        cropArea: JSON.parse(localStorage.getItem("cropArea")),
        admin: JSON.parse(localStorage.getItem("admin")),
        testimonial: JSON.parse(localStorage.getItem("testimonial")),
        email: localStorage.getItem("email"),
        paidPlan: localStorage.getItem("paidPlan"),
        planExpireDate: JSON.parse(localStorage.getItem("planExpireDate")),
        didToken: localStorage.getItem("didToken"),
        issuer: localStorage.getItem("issuer"),
        memberSince: localStorage.getItem("memberSince"),
        subscribedSince: localStorage.getItem("subscribedSince"),
        secretKeyword: localStorage.getItem("secretKeyword"),
        logged: true,
        profileAvatar: localStorage.getItem("profileAvatar"),
        favourites: localStorage.getItem("favourites"),
      })
    );
  }

  function dispatchFromFetch(data) {
    localStorage.setItem("logged", true);
    localStorage.setItem("displayName", data?.userDetails?.data?.users[0].displayName);
    localStorage.setItem("secretKeyword", data?.userDetails?.data?.users[0].secretKeyword);
    localStorage.setItem("profilePic", data?.userDetails?.data?.users[0].profilePic);
    localStorage.setItem("cropArea", data?.userDetails?.data?.users[0].cropArea);

    localStorage.setItem("admin", data?.userDetails?.data?.users[0].admin);
    localStorage.setItem("testimonial", data?.userDetails?.data?.users[0].testimonial);
    localStorage.setItem("email", data?.userDetails?.data?.users[0].email);
    localStorage.setItem("paidPlan", data?.userDetails?.data?.users[0].paidPlan);
    localStorage.setItem("planExpireDate", data?.userDetails?.data?.users[0].planExpireDate);
    localStorage.setItem("memberSince", data?.userDetails?.data?.users[0].registerDate);
    localStorage.setItem("subscribedSince", data?.userDetails?.data?.users[0].subscribedIn);
    localStorage.setItem("profileAvatar", data?.userDetails?.data?.users[0].profilePic);
    localStorage.setItem("favourites", data?.userDetails?.data?.users[0].favouriteExercises);

    localStorage.setItem("issuer", data?.userDetails?.data?.users[0].issuer);

    dispatch(
      setUserState({
        ...userRedux,
        displayName: data?.userDetails?.data?.users[0].displayName,
        profilePic: data?.userDetails?.data?.users[0].profilePic,
        cropArea: data?.userDetails?.data?.users[0].cropArea,
        admin: data?.userDetails?.data?.users[0].admin,
        testimonial: data?.userDetails?.data?.users[0].testimonial,
        email: data?.userDetails?.data?.users[0].email,
        paidPlan: data?.userDetails?.data?.users[0].paidPlan,
        planExpireDate: data?.userDetails?.data?.users[0].planExpireDate,
        memberSince: data?.userDetails?.data?.users[0].memberSince,
        subscribedSince: data?.userDetails?.data?.users[0].subscribedSince,
        profileAvatar: data?.userDetails?.data?.users[0].profileAvatar,
        favourites: data?.userDetails?.data?.users[0].favourites,
        secretKeyword: data?.userDetails?.data?.users[0].secretKeyword,
      })
    );
  }

  async function checkPlan() {
    if (userRedux.paidPlan !== null && userRedux.planExpireDate !== 0) {
      const dateNow = Math.floor(Date.now() / 1000);
      if (dateNow > userRedux.planExpireDate) {
        userRedux.paidPlan = null;
        userRedux.planExpireDate = 0;
        dispatch(
          setSnackbar({
            open: true,
            content:
              "Your subscription on our platform has expired. You can renew it by visiting the pricing page.",
          })
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
      dispatch(
        setUserState({
          ...userRedux,
          profilePic: img,
        })
      );
    }
  };

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

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async e => {
    e.preventDefault();

    dispatch(
      setUserState({
        ...userRedux,
        displayName: "",
        profilePic: "",
        admin: 0,
        testimonial: "",
        email: "",
        logged: false,
        magicToken: "",
      })
    );

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
                    src={localStorage.getItem("profilePic")}
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
          {userRedux.admin === 1 && (
            <MenuItem onClick={() => router.push("/adminPage")}>
              <ListItemIcon>
                <Settings fontSize="small" color="pink" />
              </ListItemIcon>
              Admin Page
            </MenuItem>
          )}
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
