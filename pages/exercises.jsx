import { useState, useEffect, useContext } from "react";
import Header from "../components/Header/header.component";
import styles from "../css/Exercises.module.css";
import { motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { magic } from "../lib/magic-client";
import { fetchData, exerciseOptions } from "../utils/fetchData";
import ExerciseCard from "../components/ExerciseCard/exercise-card.component";
import useWindowDimensions from "../utils/useWindowDimensions";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useRouter } from "next/router";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { theme, theme2 } from "../utils/muiTheme";
import { exerciseContext } from "../lib/exerciseContext";
import { useSelector } from "react-redux";

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
];

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

const Exercises = () => {
  const [page, setPage] = useState(1);
  const [bodyPart, setBodyPart] = useState("");
  const [bodyPartsPage, setBodyPartsPage] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateExercises, setUpdateExercises } = useContext(exerciseContext);

  const userRedux = useSelector(state => state.user.user);

  const router = useRouter();

  const handleChange = value => {
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

  useEffect(() => {
    (async () => {
      const res2 = await fetch("/api/getFavourites", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
          }),
        },
      });
      const data2 = await res2.json();
      setFavourites(data2?.getToFavouritesForUser?.data?.favourites);
    })();
  }, [updateExercises]);

  useEffect(() => {
    if (width > breakPointWidth) {
      setBodyPartsPage(1);
    }
  }, [width]);

  useEffect(() => {
    (async () => {
      if (userRedux.logged) {
        const res2 = await fetch("/api/getFavourites", {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
            }),
          },
        });
        const data2 = await res2.json();
        setFavourites(data2?.getToFavouritesForUser?.data?.favourites);
        if (userRedux.paidPlan === null && userRedux.planExpireDate === 0) router.push("/pricing");
        else setIsLoading(false);
      } else {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (!isLoggedIn) router.push("/login");
        else {
          const res = await fetch("/api/userDetails");
          const data = await res.json();

          const { paidPlan, planExpireDate } = data?.userDetails?.data?.users[0];
          if (paidPlan === null && planExpireDate === 0) router.push("/pricing");
          else setIsLoading(false);
        }
      }
    })();
  }, [userRedux]);

  useEffect(() => {
    (async function () {
      const data = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
        options
      );
      const res = await data.json();
      setExercises(res);
    })();
  }, [bodyPart]);

  const increaseCategories = () => {
    setBodyPartsPage(bodyPartsPage + 1);
  };

  const decreaseCategories = () => {
    setBodyPartsPage(bodyPartsPage - 1);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Exercises</title>
      </Head>
      <Header />
      {isLoading ? (
        <div className={styles.content} stlye={{ height: isLoading ? "100vh" : "initial" }}>
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
                    <button
                      className={styles.bodyPart}
                      key={i}
                      onClick={e => setBodyPart(e.target.textContent)}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <>
                    <ThemeProvider theme={theme2}>
                      <IconButton
                        onClick={decreaseCategories}
                        className={styles.iconButton}
                        style={{
                          pointerEvents: bodyPartsPage < 2 ? "none" : "all",
                          opacity: bodyPartsPage < 2 ? "0.2" : "1",
                        }}
                      >
                        <KeyboardArrowLeftIcon
                          color="neutral"
                          style={{
                            fontSize: width > breakPointWidth ? "2.5em" : "1.5em",
                          }}
                        />
                      </IconButton>
                      {currentEBodyPart.map((item, i) => (
                        <motion.button
                          className={styles.bodyPart}
                          key={i}
                          onClick={e => setBodyPart(e.target.textContent)}
                        >
                          {item}
                        </motion.button>
                      ))}
                      <IconButton
                        onClick={increaseCategories}
                        className={styles.iconButton}
                        style={{
                          pointerEvents:
                            width > breakPointWidth
                              ? bodyPartsPage > 1
                                ? "none"
                                : "all"
                              : bodyPartsPage > 4
                              ? "none"
                              : "all",
                          opacity:
                            width > breakPointWidth
                              ? bodyPartsPage > 1
                                ? "0.2"
                                : "1"
                              : bodyPartsPage > 4
                              ? "0.2"
                              : "1",
                        }}
                      >
                        <KeyboardArrowRightIcon
                          color="neutral"
                          style={{
                            fontSize: width > breakPointWidth ? "2.5em" : "1.5em",
                          }}
                        />
                      </IconButton>
                    </ThemeProvider>
                  </>
                )}
              </motion.div>
              <div className={styles.exercisess}>
                {bodyPart === "" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <motion.h1
                      className={styles.text}
                      animate={{ opacity: [0, 1] }}
                      transition={{ delay: 0.5 }}
                    >
                      Favourites
                    </motion.h1>
                    <div
                      style={{
                        display: "grid",
                        gap: "2ch",
                        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr)",
                        overflow: "auto",
                      }}
                    >
                      {favourites.map((item, i) =>
                        favourites.length === 1 ? (
                          <>
                            <ExerciseCard item={item} key={i} last={true} fav={true} />
                          </>
                        ) : (
                          <ExerciseCard item={item} key={i} fav={true} />
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  currentExercises.map((item, i) =>
                    currentExercises.length === 1 ? (
                      <>
                        <ExerciseCard item={item} key={i} last={true} />
                      </>
                    ) : (
                      <ExerciseCard item={item} key={i} />
                    )
                  )
                )}
              </div>
            </div>
          </div>
          <div className={styles.pagination}>
            {bodyPart === "" ? null : (
              <ThemeProvider theme={theme}>
                <Pagination
                  count={Math.ceil(exercises.length / exercisesPerPage)}
                  page={page}
                  onChange={handleChange}
                  defaultPage={1}
                  variant="outlined"
                  color="secondary"
                  size={height > 420 ? "large" : "medium"}
                />
              </ThemeProvider>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
