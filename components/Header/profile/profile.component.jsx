import Avatar from "@mui/material/Avatar";
import styles from "../../../css/components/ProfileButton.module.css";
import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { didTokenContext } from "../../../lib/didTokenContext";
import { magic } from "../../../lib/magic-client";
import CircularProgress from "@mui/material/CircularProgress";
import { userContext } from "../../../lib/userContext";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Link from "next/link";
import { cropImages } from "../../../lib/cropImages";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../../redux/user.slice";
import { setSnackbar } from "../../../redux/snackbar.slice";
import { ROUTES } from "../../../Routes";
import { Menu } from "../../../interface/Menu.tsx";

const ProfileButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const { didToken, setDidToken } = useContext(didTokenContext);
  const isMounted = useRef(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState();
  const [profilePic, setProfilePic] = useState();
  const { user, setUser } = useContext(userContext);

  const dispatch = useDispatch();
  const userRedux = useSelector(state => state.user.user);

  const menuOptions = [
    {
      key: "1",
      label: "Profile Dashboard",
      icon: <ManageAccountsIcon fontSize="small" color="inherit" />,
      onClick: () => router.push(ROUTES.profile),
      show: true,
    },
    {
      key: "2",
      label: "Admin",
      icon: <Settings fontSize="small" color="inherit" />,
      onClick: () => router.push(ROUTES.adminPage),
      show: userRedux.admin === 1 ? true : false,
    },
    {
      key: "3",
      label: "Logout",
      icon: <Logout fontSize="small" color="inherit" />,
      onClick: () => logout(),
      show: true,
    },
  ];

  function dispatchFromFetch(data) {
    if (data?.userDetails?.errors) {
      console.log("Something went wrong", data?.userDetails?.errors[0]?.message);
    } else {
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
          issuer: data?.userDetails?.data?.users[0].issuer,
          memberSince: data?.userDetails?.data?.users[0].memberSince,
          subscribedSince: data?.userDetails?.data?.users[0].subscribedSince,
          profileAvatar: data?.userDetails?.data?.users[0].profileAvatar,
          secretKeyword: data?.userDetails?.data?.users[0].secretKeyword,
          needsUpdate: false,
          logged: true,
        })
      );
    }
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
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        if (userRedux.needsUpdate) {
          try {
            const { email } = await magic.user.getMetadata();
            if (email) {
              const didToken = await magic.user.getIdToken();

              const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_USER_DETAILS}`);
              const data = await res.json();
              console.log(data?.userDetails?.data?.users[0]);

              if (isMounted.current) {
                await checkPlan();
                dispatchFromFetch(data);
                cropPhoto();
                setLoggedIn(true);
                setProfilePic(data?.userDetails?.data?.users[0].profilePic);
                setDisplayName(data?.userDetails?.data?.users[0].displayName);
                setDidToken(didToken);
              }
            }
          } catch (error) {
            console.error("Can't retrieve email in NavBar", error);
          }
        } else {
          setProfilePic(userRedux.profilePic);
          setDisplayName(userRedux.displayName);
          setLoggedIn(userRedux.logged);
        }
      }

      setIsLoading(false);
    })();

    return () => {
      isMounted.current = false;
    };
  }, [userRedux]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    console.log(e);

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
        issuer: "",
      })
    );

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
      router.push(ROUTES.login);
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
                  displayName === null ? (
                    userRedux.email[0]
                  ) : (
                    displayName[0]
                  )
                ) : (
                  <Image src={userRedux.profilePic} alt="" layout="fill" objectFit="cover" />
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
      {anchorEl ? (
        <>
          <Menu
            id="account-menu"
            anchor={anchorEl}
            handleClose={handleClose}
            options={menuOptions}
          />
        </>
      ) : null}
    </>
  );
};

export default ProfileButton;
