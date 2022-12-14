import styles from "../../css/components/ExerciseCard.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setExercisesState } from "../../redux/exercises.slice";
import { Button } from "../../interface/Button.tsx";

const ExerciseCard = ({ item, last = false, fav = false }) => {
  const [hover, setHover] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const userRedux = useSelector(state => state.user.user);
  const exercisesRedux = useSelector(state => state.user.user);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/checkFavourites", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            gif: item.gifUrl,
          }),
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.checkFavouriteQueryForUser === 0) setFavourite(false);
      else setFavourite(true);
      setIsLoading(false);
    })();
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    if (favourite === false) {
      const res = await fetch("/api/checkFavourites", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            gif: item.gifUrl,
          }),
        },
      });
      const data = await res.json();
      console.log(data);

      if (data.checkFavouriteQueryForUser === 0) {
        const res2 = await fetch("/api/addToFavourites", {
          method: "POST",
          headers: {
            body: JSON.stringify({
              issuer: userRedux.issuer,
              gif: item.gifUrl,
              name: item.name,
            }),
          },
        });
        const data2 = await res2.json();
        console.log(data2);
      } else setFavourite(true);
      setIsLoading(false);
    } else {
      const res = await fetch("/api/deleteFavourites", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
            gif: fav ? item.gif : item.gifUrl,
          }),
        },
      });
      dispatch(setExercisesState({ exercises: !exercisesRedux.exercises }));
      const data = await res.json();
      console.log(data);
      setFavourite(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={last === true ? styles.lastExerciseCard : styles.exerciseCard}
      animate={{ scale: [0, 1] }}
      initial={{ scale: 0 }}
      transition={{ delay: 0.2 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {fav ? (
        <Image src={item.gif} alt="" layout="fill" />
      ) : (
        <Image src={item.gifUrl} alt="" layout="fill" />
      )}
      <motion.div
        className={styles.hoverContainer}
        animate={{ y: hover ? 0 : 280 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.exerciseName}>{item.name}</h1>
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
      </motion.div>
    </motion.div>
  );
};

export default ExerciseCard;
