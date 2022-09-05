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

  async function checkPlan() {
    if (user.paidPlan !== null && user.planExpireDate !== 0) {
      const dateNow = Math.floor(Date.now() / 1000);
      if (dateNow > user.planExpireDate) {
        user.paidPlan = null;
        user.planExpireDate = 0;
        setSnackbarContent(
          "Your subscription on our platform has expired. You can renew it by visiting the pricing page."
        );
        const res2 = await fetch("/api/updateSubscription", {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: user.issuer,
              planExpireDate: user.planExpireDate,
              paidPlan: user.paidPlan,
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
      user.profilePic !== "" &&
      user.logged &&
      user.cropped === false &&
      user.cropArea !== null
    ) {
      user.cropped = true;
      const img = await cropImages(user.profilePic, user.cropArea);
      user.profilePic = img;
    }
  };

  useEffect(() => {
    (async () => {
      if (!user.logged) {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          try {
            const { email } = await magic.user.getMetadata();
            if (email) {
              const didToken = await magic.user.getIdToken();

              const res = await fetch("/api/userDetails");
              const data = await res.json();

              if (isMounted.current) {
                setProfilePic(data?.userDetails?.data?.users[0].profilePic);
                setDisplayName(data?.userDetails?.data?.users[0].displayName);
                user.displayName =
                  data?.userDetails?.data?.users[0].displayName;
                user.profilePic = data?.userDetails?.data?.users[0].profilePic;
                user.cropArea = JSON.parse(
                  data?.userDetails?.data?.users[0].cropArea
                );
                user.admin = data?.userDetails?.data?.users[0].admin;
                user.testimonial =
                  data?.userDetails?.data?.users[0].testimonial;
                user.email = data?.userDetails?.data?.users[0].email;
                user.paidPlan = data?.userDetails?.data?.users[0].paidPlan;
                user.planExpireDate =
                  data?.userDetails?.data?.users[0].planExpireDate;
                user.magicToken = didToken;
                user.issuer = data?.userDetails?.data?.users[0].issuer;
                user.memberSince =
                  data?.userDetails?.data?.users[0].registerDate;
                user.subscribedSince =
                  data?.userDetails?.data?.users[0].subscribedIn;
                user.secretKeyword =
                  data?.userDetails?.data?.users[0].secretKeyword;
                user.logged = true;
                user.profileAvatar =
                  data?.userDetails?.data?.users[0].profilePic;
                user.favourites =
                  data?.userDetails?.data?.users[0].favouriteExercises;

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
      } else {
        setDisplayName(user.displayName);
        setLoggedIn(user.logged);
        setProfilePic(user.profilePic);
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

    user.displayName = "";
    user.profilePic = "";
    user.admin = "";
    user.testimonial = "";
    user.email = "";
    user.magicToken = "";
    user.logged = false;

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
                {user.profilePic === null ? (
                  displayName[0]
                ) : (
                  <Image
                    src={user.profilePic}
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
          {user.admin === 1 ? (
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
