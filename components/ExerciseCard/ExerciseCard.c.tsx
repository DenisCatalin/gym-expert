import styles from "../../css/components/ExerciseCard.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setExercisesState } from "../../redux/exercises.slice";
import { Button } from "../../interface/Button";
import fetchData from "../../utils/fetchData";
import { buttonTheme } from "../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import { setScheduleState } from "../../redux/schedule.slice";
import { setSnackbar } from "../../redux/snackbar.slice";

type IExerciseCard = {
  item?: Object | any;
  last?: boolean;
  fav?: boolean;
  toSave: string;
};

const ExerciseCard = ({ item, last = false, fav = false, toSave }: IExerciseCard) => {
  const [hover, setHover] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const userRedux = useSelector((state: any) => state.user.user);
  const exercisesRedux = useSelector((state: any) => state.exercises.exercises);
  const scheduleRedux = useSelector((state: any) => state.schedule.schedule);

  useEffect(() => {
    (async () => {
      const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_CHECK_FAVOURITES}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            gif: item?.gifUrl,
          }),
        },
      });
      if (data.checkFavouriteQueryForUser === 0) {
        setFavourite(false);
      } else {
        setFavourite(true);
      }
      setIsLoading(false);
    })();
  }, [exercisesRedux]);

  const handleClick = async () => {
    setIsLoading(true);
    if (!favourite) {
      const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_CHECK_FAVOURITES}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            gif: item?.gifUrl,
          }),
        },
      });

      if (data.checkFavouriteQueryForUser === 0) {
        await fetchData(`${process.env.NEXT_PUBLIC_FETCH_ADD_FAVOURITES}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
              gif: item?.gifUrl,
              name: item?.name,
              category: toSave,
            }),
          },
        });
        dispatch(setExercisesState({ ...exercisesRedux, exercises: !exercisesRedux?.exercises }));
      } else {
        setFavourite(true);
      }
      setIsLoading(false);
    } else {
      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_DELETE_FAVOURITES}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            gif: fav ? item?.gif : item?.gifUrl,
          }),
        },
      });
      dispatch(setExercisesState({ ...exercisesRedux, exercises: !exercisesRedux?.exercises }));
      setFavourite(false);
      setIsLoading(false);
    }
  };

  const addSchedule = () => {
    const gif = fav ? item?.gif : item?.gifUrl;
    dispatch(
      setSnackbar({
        open: true,
        content: "Exercise added to current schedule",
      })
    );
    dispatch(
      setScheduleState({
        ...scheduleRedux,
        exercises: [...scheduleRedux.exercises, gif],
      })
    );
  };

  return (
    <motion.div
      className={last === true ? styles.lastExerciseCard : styles.exerciseCard}
      animate={{ scale: [0, 1] }}
      initial={{ scale: 0 }}
      transition={{ delay: 0.2 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      tabIndex={0}
      aria-label={item?.name}
    >
      {fav ? (
        <Image src={item?.gif} alt="" layout="fill" />
      ) : (
        <Image src={item?.gifUrl} alt="" layout="fill" />
      )}
      <motion.div
        className={styles.hoverContainer}
        animate={{ y: hover ? 0 : 280 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.exerciseName}>{item?.name}</h1>
        <ThemeProvider theme={buttonTheme}>
          <Button
            className={styles.addToFav}
            onClick={handleClick}
            label={
              <>
                {isLoading ? (
                  <CircularProgress color="secondary" />
                ) : favourite ? (
                  "Remove from favourites"
                ) : (
                  "Add to favourites"
                )}
              </>
            }
          />
          {scheduleRedux.scheduleMode ? (
            <>
              {scheduleRedux.exercises.includes(item.gif) ||
              scheduleRedux.exercises.includes(item.gifUrl) ? null : (
                <>
                  <Button
                    className={styles.scheduleButton}
                    onClick={addSchedule}
                    label={"Schedule"}
                  />
                </>
              )}
            </>
          ) : null}
        </ThemeProvider>
      </motion.div>
    </motion.div>
  );
};

export default ExerciseCard;
