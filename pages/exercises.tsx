import React, { useState, useEffect } from "react";
import styles from "../css/Exercises.module.css";
import { motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import { IconButton } from "../interface/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { magic } from "../lib/magic-client";
import ExerciseCard from "../components/ExerciseCard/ExerciseCard.c";
import useWindowDimensions from "../utils/useWindowDimensions";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useRouter } from "next/router";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import {
  buttonTheme,
  themePagination,
  theme2,
  inputTheme,
  scheduleButton,
} from "../utils/muiTheme";
import { useSelector, useDispatch } from "react-redux";
import { ROUTES } from "../Routes";
import { Button } from "../interface/Button";
import { MotionButton } from "../interface/MotionButton";
import fetchData from "../utils/fetchData";
import { MotionTypo } from "../interface/MotionTypo";
import Select from "../interface/Select";
import { Dialog } from "../interface/Dialog";
import { removeItem, setScheduleState } from "../redux/schedule.slice";
import firebase from "../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Image from "next/image";
import CustomSnackbar from "../components/Snackbar/Snackbar.c";
import { setSnackbar } from "../redux/snackbar.slice";
import DialogSchedule from "../components/Dialogs/DialogSchedule.c";
import Input from "../interface/Input";

const breakPointWidth = 719;

const bodyParts = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
  "favourites",
];

const selectOptions = [
  "All",
  "Back",
  "Cardio",
  "Chest",
  "Lower arms",
  "Lower legs",
  "Neck",
  "Shoulders",
  "Upper arms",
  "Upper legs",
  "Waist",
];

let sOptions: { key: number; label: string }[] = [];
selectOptions.map((options, idx) => {
  sOptions.push({
    key: idx,
    label: options,
  });
});

const exercise = [
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
];

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "3fb777c1b0msh9d24b739a3e998ep18c66fjsn68f4a6654b4b",
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
  },
};

// const options = {
//   method: "GET",
//   headers: {
//     "X-RapidAPI-Key": "3fb777c1b0msh9d24b739a3e998ep18c66fjsn68f4a6654b4b",
//     "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
//   },
// };

const Exercises = () => {
  const [page, setPage] = useState(1);
  const [bodyPart, setBodyPart] = useState("favourites");
  const [bodyPartsPage, setBodyPartsPage] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [favourites, setFavourites] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openScheduleDialog, setOpenScheduleDialog] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<number | undefined>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const userRedux = useSelector((state: any) => state.user.user);
  const exercisesRedux = useSelector((state: any) => state.exercises.exercises);
  const scheduleRedux = useSelector((state: any) => state.schedule.schedule);
  const [search, setSearch] = useState<string>("");

  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (_event: any, value: React.SetStateAction<number>) => {
    setPage(value);
  };

  const { width, height } = useWindowDimensions();

  const exercisesPerPage = 8;
  const indexOfLastExercise = page * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);

  const bodyPartsPerPage = width > 719 ? 5 : 2;
  const indexOfLastBodyPart = bodyPartsPage * bodyPartsPerPage;
  const indexOfFirstBodyPart = indexOfLastBodyPart - bodyPartsPerPage;
  const currentEBodyPart = bodyParts.slice(indexOfFirstBodyPart, indexOfLastBodyPart);

  const firestore = firebase.firestore();
  const progressRef = firestore.collection("schedule");
  const exercisesRef = firestore.collection("favourites");
  const queryQ = progressRef.orderBy("day");
  const queryExercises = exercisesRef.orderBy("name");
  //@ts-ignore
  const [messages] = useCollectionData(queryQ, { id: "id" });
  //@ts-ignore
  const [favouriteExercises] = useCollectionData(queryExercises, { id: "id" });

  useEffect(() => {
    if (!userRedux.logged) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (exercisesRedux.filter === "All" || exercisesRedux.filter === "all") {
        setFavExercises("issuer");
      } else {
        setFavExercises("category");
      }
    })();
  }, [exercisesRedux]);

  useEffect(() => {
    if (width > breakPointWidth) {
      setBodyPartsPage(1);
    }
  }, [width]);

  function setFavExercises(method: string) {
    setFavourites([]);
    switch (method) {
      case "issuer": {
        favouriteExercises?.map(exercise => {
          if (exercise.issuer === userRedux.issuer) {
            setFavourites((oldArray: any) => [...oldArray, exercise]);
          }
        });
        break;
      }
      case "category": {
        favouriteExercises?.map(exercise => {
          if (exercise.issuer === userRedux.issuer && exercise.category === exercisesRedux.filter) {
            setFavourites((oldArray: any) => [...oldArray, exercise]);
          }
        });
      }
      default: {
        break;
      }
    }
  }

  useEffect(() => {
    if (userRedux.logged) {
      (async () => {
        if (userRedux.logged) {
          setFavExercises("issuer");
          if (userRedux.paidPlan === null && userRedux.planExpireDate === 0) {
            router.push(ROUTES.pricing);
          } else {
            setIsLoading(false);
          }
        } else {
          //@ts-ignore
          const isLoggedIn = await magic.user.isLoggedIn();
          if (!isLoggedIn) router.push(ROUTES.login);
          else {
            const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_USER_DETAILS}`);

            const { paidPlan, planExpireDate } = data?.userDetails?.data?.users[0];
            if (paidPlan === null && planExpireDate === 0) router.push(ROUTES.pricing);
            else setIsLoading(false);
          }
        }
      })();
    }
  }, [userRedux]);

  useEffect(() => {
    if (bodyPart === "favourites") {
    } else {
      (async function () {
        const data = await fetchData(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
          options
        );
        for (const exercise of data) {
          const isFavorite = favourites.some((favorite: any) => favorite.name === exercise.name);
          exercise.favourite = isFavorite;
        }
        setExercises(data);
      })();
    }
  }, [bodyPart, exercisesRedux]);

  const increaseCategories = () => {
    setBodyPartsPage(bodyPartsPage + 1);
  };

  const decreaseCategories = () => {
    setBodyPartsPage(bodyPartsPage - 1);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    dispatch(
      setScheduleState({
        ...scheduleRedux,
        scheduleMode: false,
        exercises: [],
        day: 0,
        month: "",
        name: "",
      })
    );
  };

  const setupDialog = () => {
    setOpenScheduleDialog(true);
  };

  const handleClose = () => {
    setOpenScheduleDialog(false);
  };

  const scheduleMore = () => {
    setOpenDialog(false);
  };

  const scheduleExercises = async () => {
    if (scheduleRedux.exercises.length === 0) {
      dispatch(
        setSnackbar({
          open: true,
          content: "You cannot schedule anything without at least one exercise",
        })
      );
      return;
    }
    {
      messages &&
        (await progressRef.add({
          id: messages.length + 1,
          day: scheduleRedux.day,
          month: scheduleRedux.month,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          exercises: scheduleRedux.exercises,
          sender: userRedux.issuer,
          name: scheduleRedux.name,
        }));
    }

    const date = new Date();
    const actualMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const ISOString = `${date.getFullYear()}-${actualMonth}-${scheduleRedux.day}T09:00:00`;

    try {
      await fetchData("/api/scheduledEmail", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            type: "schedule",
            email: userRedux.email,
            scheduledDate: ISOString,
            message: `
              <div
                style="background: #140630; border-radius: 20px; color: #DC82F2; padding: 1rem; font-family: 'Kodchasan', sans-serif;">
                <div style="display: flex; justify-content: center; align-items: center;">
                    <img src="https://res.cloudinary.com/dgkdpysp5/image/upload/v1682434325/logo-gym_k9lpki.png"
                        style="width: 50px; height: 50px;" alt="Logo" />
                    <h2 style="color: #DC82F2;">GYM-EXPERT</h2>
                </div>
                <h4 style="font-weight: 100;">Hello!\r\nThis is just a reminder for your scheduled set of exercises on our platform for today (${scheduleRedux.name}).\r\n\r\nNOTE: You have received this e-mail because you have scheduled a set of exercises for this day.</h4>
                <h4 style="font-weight: 100;">Best wishes,\r\nGym-Expert Team</h4>
              </div>
            `,
          }),
        },
      });
    } catch (err) {
      console.error(err);
    }

    setOpenDialog(false);
    dispatch(
      setSnackbar({
        open: true,
        content: "You successfully added the schedule in your profile dashboard",
      })
    );
    dispatch(
      setScheduleState({
        ...scheduleRedux,
        scheduleMode: false,
        exercises: [],
        day: 0,
        month: "",
        name: "",
      })
    );
  };

  useEffect(() => {
    setFavExercises("issuer");
  }, [favouriteExercises]);

  const deleteFromArray = () => {
    dispatch(removeItem(exerciseToDelete));
    setOpenDeleteDialog(false);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const deleteDialog = (idx: number) => {
    setOpenDeleteDialog(true);
    setExerciseToDelete(idx);
  };

  useEffect(() => {
    if (search.length > 4) {
      if (bodyPart === "favourites") {
      } else {
        (async function () {
          const data = await fetchData(
            `https://exercisedb.p.rapidapi.com/exercises/name/${search}`,
            options
          );
          for (const exercise of data) {
            const isFavorite = favourites.some((favorite: any) => favorite.id === exercise.id);
            exercise.favourite = isFavorite;
          }
          setExercises(data);
        })();
      }
    }
  }, [search]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Exercises</title>
      </Head>
      <CustomSnackbar />
      {isLoading ? (
        <div className={styles.content} style={{ height: isLoading ? "100vh" : "initial" }}>
          <div className={styles.exercises}>
            <Stack sx={{ width: "50%", color: "grey.500" }} spacing={2}>
              <LinearProgress color="secondary" />
            </Stack>
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.exercises}>
            <div className={styles.altContent}>
              <motion.div className={styles.header} animate={{ opacity: [0, 1], y: [100, 0] }}>
                {width > 900 ? (
                  bodyParts.map((item, i) => (
                    <ThemeProvider theme={buttonTheme} key={i}>
                      <Button
                        key={i}
                        className={styles.bodyPart}
                        onClick={(e: any) => setBodyPart(e.target.textContent)}
                        label={item}
                      />
                    </ThemeProvider>
                  ))
                ) : (
                  <>
                    <ThemeProvider theme={theme2}>
                      <IconButton
                        onClick={decreaseCategories}
                        className={styles.iconButton}
                        styles={{
                          pointerEvents: bodyPartsPage < 2 ? "none" : "all",
                          opacity: bodyPartsPage < 2 ? "0.2" : "1",
                        }}
                        tooltip={"Previous"}
                        tooltipPlacement="bottom"
                        label={
                          <>
                            <KeyboardArrowLeftIcon
                              htmlColor="#fff"
                              style={{
                                fontSize: width > breakPointWidth ? "2.5em" : "1.5em",
                              }}
                            />
                          </>
                        }
                      />
                      {currentEBodyPart.map((item, i) => (
                        <MotionButton
                          key={i}
                          className={styles.bodyPart}
                          onClick={(e: any) => setBodyPart(e.target.textContent)}
                          label={<>{item}</>}
                        />
                      ))}
                      <IconButton
                        onClick={increaseCategories}
                        className={styles.iconButton}
                        styles={{
                          pointerEvents:
                            width > breakPointWidth
                              ? bodyPartsPage > 1
                                ? "none"
                                : "all"
                              : bodyPartsPage > 5
                              ? "none"
                              : "all",
                          opacity:
                            width > breakPointWidth
                              ? bodyPartsPage > 1
                                ? "0.2"
                                : "1"
                              : bodyPartsPage > 5
                              ? "0.2"
                              : "1",
                        }}
                        label={
                          <>
                            <KeyboardArrowRightIcon
                              htmlColor="#fff"
                              style={{
                                fontSize: width > breakPointWidth ? "2.5em" : "1.5em",
                              }}
                            />
                          </>
                        }
                        tooltip="Next"
                        tooltipPlacement="bottom"
                      />
                    </ThemeProvider>
                  </>
                )}
              </motion.div>
              <ThemeProvider theme={scheduleButton}>
                <Button
                  label={scheduleRedux.scheduleMode ? "Done schedule" : "Schedule"}
                  className={
                    scheduleRedux.scheduleMode ? styles.doneSchedule2 : styles.doneSchedule
                  }
                  onClick={scheduleRedux.scheduleMode ? handleOpenDialog : setupDialog}
                />
              </ThemeProvider>

              <div style={{ display: bodyPart === "favourites" ? "none" : "initial" }}>
                <ThemeProvider theme={inputTheme}>
                  <Input
                    label={"Search..."}
                    color="secondary"
                    type="text"
                    value={search}
                    variant="outlined"
                    onChange={(e: any) => setSearch(e.target.value)}
                    className={styles.textField}
                  />
                </ThemeProvider>
              </div>
              <div className={styles.exercisess}>
                {bodyPart === "favourites" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div className={styles.spacer}>
                      <MotionTypo
                        className={styles.text}
                        animateOptions="opacity"
                        transitionDuration={2}
                        content="Favourites"
                      />
                      <Select selectFor="Exercises" label="Filter" val="All" options={sOptions} />
                    </div>
                    <div className={styles.showExercises}>
                      {favourites &&
                        favourites?.map((item: any, i: number) =>
                          favourites.length === 1 ? (
                            <>
                              <ExerciseCard
                                item={item}
                                key={i}
                                last={true}
                                fav={true}
                                toSave={bodyPart}
                              />
                            </>
                          ) : (
                            <ExerciseCard item={item} key={i} toSave={bodyPart} fav={true} />
                          )
                        )}
                    </div>
                  </div>
                ) : (
                  currentExercises.map((item: any, i) =>
                    currentExercises.length === 1 ? (
                      <>
                        <ExerciseCard
                          item={item}
                          key={i}
                          last={true}
                          fav={item?.favourite}
                          toSave={bodyPart}
                        />
                      </>
                    ) : (
                      <ExerciseCard item={item} key={i} toSave={bodyPart} fav={item?.favourite} />
                    )
                  )
                )}
              </div>
            </div>
          </div>
          <div className={styles.pagination}>
            {bodyPart === "favourites" ? null : (
              <ThemeProvider theme={themePagination}>
                <Pagination
                  count={Math.ceil(exercises.length / exercisesPerPage)}
                  page={page}
                  onChange={handleChange}
                  defaultPage={1}
                  variant="outlined"
                  color="secondary"
                  size={height > 950 ? "large" : "medium"}
                />
              </ThemeProvider>
            )}
          </div>
        </div>
      )}
      <Dialog
        fullWidth={true}
        maxWidth={
          scheduleRedux.exercises.length > 3
            ? "lg"
            : scheduleRedux.exercises.length < 3
            ? "xs"
            : "sm"
        }
        title={`Schedule for ${scheduleRedux.day} ${scheduleRedux.month}`}
        open={openDialog}
        onClose={handleCloseDialog}
        contentStyles={styles.background}
        textStyles={styles.text}
        contentText={"Here is a preview of your selected exercises:"}
        contentOther={
          <>
            <div className={styles.previewExercises}>
              {scheduleRedux.exercises.map((exercise: string, idx: number) => (
                <div className={styles.fmm} onClick={() => deleteDialog(idx)} key={idx}>
                  <Image
                    src={exercise}
                    alt="Preview"
                    key={idx}
                    layout="fill"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              ))}
            </div>
          </>
        }
        actions={
          <>
            <Button
              label="Close"
              role="button"
              color="secondary"
              aria-label="close dialog"
              onClick={handleCloseDialog}
            />
            <Button
              label="Schedule more"
              role="button"
              color="secondary"
              aria-label="close dialog"
              onClick={scheduleMore}
            />
            <Button
              label="Schedule"
              role="button"
              color="secondary"
              aria-label="close dialog"
              onClick={scheduleExercises}
            />
          </>
        }
      />
      <DialogSchedule open={openScheduleDialog} onClose={handleClose} duplicate={false} />
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialog}
        title="Remove exercise"
        contentText="Are you sure you want to delete this exercise?"
        contentStyles={styles.background}
        textStyles={styles.text}
        actions={
          <>
            <Button color="secondary" role="button" label="No" onClick={closeDeleteDialog} />
            <Button color="secondary" role="button" label="Yes" onClick={deleteFromArray} />
          </>
        }
      />
    </div>
  );
};

export default Exercises;
