import { useState, useEffect } from "react";
import Header from "../components/Header/header.component";
import styles from "../css/Exercises.module.css";
import { motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Head from "next/head";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchData, exerciseOptions } from "../utils/fetchData";
import ExerciseCard from "../components/ExerciseCard/exercise-card.component";
import useWindowDimensions from "../utils/useWindowDimensions";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const breakPointWidth = 719;

const booodyParts = [
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
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
  {
    bodyPart: "chest",
    equipment: "body weight",
    gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/3294.gif",
    id: "3294",
    name: "archer push up",
    target: "pectorals",
  },
];

const theme2 = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#434343",
      darker: "#434343",
    },
    neutral: {
      main: "#FFFFFF",
      contrastText: "#fff",
    },
    dark: {
      main: "#434343",
      contrastText: "#434343",
    },
  },
});

const theme = createTheme({
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#FFF",
          fontSize: "1.2em",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          background: "rgba(220, 130, 242, .3)",
          fontSize: "1em",
        },
      },
    },
  },
});

const options = {
  // method: "GET",
  // headers: {
  //   "X-RapidAPI-Key": "3fb777c1b0msh9d24b739a3e998ep18c66fjsn68f4a6654b4b",
  //   "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
  // },
};

const Exercises = () => {
  const [page, setPage] = useState(1);
  const [bodyParts, setBodyParts] = useState();
  const [bodyPart, setBodyPart] = useState("");
  const [fetched, setFetched] = useState(false);
  const [bodyPartsPage, setBodyPartsPage] = useState(1);
  const [exercises, setExercises] = useState([]);
  const handleChange = (event, value) => {
    setPage(value);
  };

  const { width, height } = useWindowDimensions();

  const exercisesPerPage = 8;
  const indexOfLastExercise = page * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercise.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const bodyPartsPerPage = width > 719 ? 5 : 2;
  const indexOfLastBodyPart = bodyPartsPage * bodyPartsPerPage;
  const indexOfFirstBodyPart = indexOfLastBodyPart - bodyPartsPerPage;
  const currentEBodyPart = booodyParts.slice(
    indexOfFirstBodyPart,
    indexOfLastBodyPart
  );

  useEffect(() => {
    if (width > breakPointWidth) {
      setBodyPartsPage(1);
    }
  }, [width]);

  // useEffect(() => {
  //   (async function () {
  //     const data = await fetch(
  //       "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
  //       options
  //     );
  //     const res = await data.json();
  //     setBodyParts(res);
  //     setFetched(true);
  //   })();
  // }, []);

  // useEffect(() => {
  //   (async function () {
  //     const data = await fetch(
  //       `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
  //       options
  //     );
  //     const res = await data.json();
  //     setExercises(res);
  //   })();
  // }, [bodyPart]);

  const increaseCategories = () => {
    setBodyPartsPage(bodyPartsPage + 1);
  };

  const decreaseCategories = () => {
    setBodyPartsPage(bodyPartsPage - 1);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Gym-Expert - Exercises</title>
      </Head>
      <Header />
      <div className={styles.content}>
        <div className={styles.exercises}>
          <div className={styles.altContent}>
            <motion.div
              className={styles.header}
              animate={{ opacity: [0, 1], y: [100, 0] }}
            >
              {width > 900 ? (
                booodyParts.map((item, i) => (
                  <button
                    className={styles.bodyPart}
                    key={i}
                    onClick={(e) => setBodyPart(e.target.textContent)}
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
                        onClick={(e) => setBodyPart(e.target.textContent)}
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
              {/* {fetched ? (
                <>
                  {bodyParts.length !== undefined ? (
                    bodyParts.map((item, i) => (
                      <motion.button
                        className={styles.bodyPart}
                        key={i}
                        onClick={(e) => setBodyPart(e.target.textContent)}
                      >
                        {item}
                      </motion.button>
                    ))
                  ) : (
                    <>
                      <h1 className={styles.text}>
                        Something went wrong loading the body parts
                      </h1>
                    </>
                  )}
                </>
              ) : (
                <CircularProgress />
              )} */}
            </motion.div>
            <div className={styles.exercisess}>
              {bodyPart === "" ? (
                <>
                  <motion.h1
                    className={styles.text}
                    animate={{ opacity: [0, 1] }}
                    transition={{ delay: 0.5 }}
                  >
                    Choose a body part
                  </motion.h1>
                </>
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
                count={Math.ceil(exercise.length / exercisesPerPage)}
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
    </div>
  );
};

export default Exercises;
