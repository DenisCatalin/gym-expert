import Avatar from "@mui/material/Avatar";
import React, { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { didTokenContext } from "../../../lib/didTokenContext";
import { magic } from "../../../lib/magic-client";
import CircularProgress from "@mui/material/CircularProgress";
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
import { Menu } from "../../../interface/Menu";
import fetchData from "../../../utils/fetchData";
import { setOtherState } from "../../../redux/others.slice";
import { avatarTheme } from "../../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";

const ProfileButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const { didToken, setDidToken } = useContext(didTokenContext);
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const userRedux = useSelector((state: any) => state.user.user);
  const otherRedux = useSelector((state: any) => state.other.other);

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

  function dispatchFromFetch(data: Object | any) {
    if (data?.userDetails?.errors) {
      console.error("Something went wrong", data?.userDetails?.errors[0]?.message);
    } else {
      dispatch(
        setUserState({
          ...userRedux,
          displayName: data?.userDetails?.data?.users[0].displayName,
          profilePic: data?.userDetails?.data?.users[0].profilePic,
          cropArea: JSON.parse(data?.userDetails?.data?.users[0].cropArea),
          admin: data?.userDetails?.data?.users[0].admin,
          testimonial: data?.userDetails?.data?.users[0].testimonial,
          email: data?.userDetails?.data?.users[0].email,
          paidPlan: data?.userDetails?.data?.users[0].paidPlan,
          planExpireDate: data?.userDetails?.data?.users[0].planExpireDate,
          issuer: data?.userDetails?.data?.users[0].issuer,
          memberSince: data?.userDetails?.data?.users[0].registerDate,
          subscribedSince: data?.userDetails?.data?.users[0].subscribedIn,
          profileAvatar: data?.userDetails?.data?.users[0].profileAvatar,
          secretKeyword: data?.userDetails?.data?.users[0].secretKeyword,
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
        const res2 = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_SUBSCRIPTION}`, {
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
        await res2.json();
      }
    }
  }

  const cropPhoto = async () => {
    if (
      userRedux.profilePic !== null &&
      userRedux.logged &&
      userRedux.cropped === false &&
      Object.keys(userRedux.cropArea).length !== 0
    ) {
      const img = await cropImages(userRedux.profilePic, userRedux.cropArea);
      dispatch(
        setUserState({
          ...userRedux,
          profileAvatar: img,
          needsUpdate: false,
        })
      );
    } else {
      if (userRedux.logged && userRedux.profilePic === null) {
        dispatch(
          setUserState({
            ...userRedux,
            needsUpdate: false,
          })
        );
      }
    }
  };

  useEffect(() => {
    (async () => {
      //@ts-ignore
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        if (userRedux.needsUpdate) {
          try {
            //@ts-ignore
            const { email } = await magic.user.getMetadata();
            if (email) {
              //@ts-ignore
              const didToken = await magic.user.getIdToken();
              const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_USER_DETAILS}`);

              dispatch(
                setOtherState({
                  ...otherRedux,
                  userFetched: true,
                })
              );

              if (isMounted.current) {
                dispatchFromFetch(data);
                setDidToken(didToken);
              }

              checkPlan();
              cropPhoto();
            }
          } catch (error) {
            console.error("Can't retrieve email in NavBar", error);
          }
        }
      }

      setIsLoading(false);
    })();

    return () => {
      isMounted.current = false;
    };
  }, [userRedux]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    dispatch(
      setUserState({
        ...userRedux,
        displayName: null,
        profilePic: null,
        admin: 0,
        testimonial: "",
        email: "",
        logged: false,
        magicToken: "",
        issuer: "",
      })
    );

    router.push(ROUTES.login);

    try {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_LOGOUT}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error logging out", error);
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
          {userRedux.logged ? (
            <div
              role="button"
              tabIndex={0}
              aria-label="Profile button"
              onKeyDown={event => event.code === "Enter" && handleClick(event)}
            >
              <ThemeProvider theme={avatarTheme}>
                <Avatar onClick={handleClick}>
                  {userRedux.profilePic === null ? (
                    userRedux.displayName === null ? (
                      userRedux.email[0]
                    ) : (
                      userRedux.displayName[0]
                    )
                  ) : (
                    <Image
                      src={userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                      priority
                      blurDataURL={
                        userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic
                      }
                    />
                  )}
                </Avatar>
              </ThemeProvider>
            </div>
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
        id="account-menu"
        anchor={anchorEl}
        handleClose={handleClose}
        options={menuOptions}
        title={userRedux.displayName}
        content={userRedux.email}
      />
    </>
  );
};

export default ProfileButton;
