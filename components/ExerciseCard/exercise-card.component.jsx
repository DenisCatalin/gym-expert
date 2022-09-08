import styles from "../../css/components/ExerciseCard.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import { userContext } from "../../lib/userContext";
import { exerciseContext } from "../../lib/exerciseContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";

const ExerciseCard = ({ item, last = false, fav = false }) => {
  const [hover, setHover] = useState(false);
  const { user, setUser } = useContext(userContext);
  const [favourite, setFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { updateExercises, setUpdateExercises } = useContext(exerciseContext);

  const userRedux = useSelector((state) => state.user);

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
            issuer: JSON.parse(localStorage.getItem("logged") === true)
              ? localStorage.getItem("issuer")
              : userRedux.issuer,
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
      setUpdateExercises(!updateExercises);
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
        <button className={styles.addToFav} onClick={handleClick}>
          {isLoading ? (
            <CircularProgress color="secondary" />
          ) : favourite ? (
            "Remove from favourites"
          ) : (
            "Add to favourites"
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ExerciseCard;
