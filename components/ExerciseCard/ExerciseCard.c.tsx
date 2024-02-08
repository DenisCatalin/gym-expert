import styles from "../../css/components/ExerciseCard.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setExercisesState } from "../../redux/exercises.slice";
import { Button } from "../../interface/Button";
import { exerciseButtonTheme } from "../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import { setScheduleState } from "../../redux/schedule.slice";
import { setSnackbar } from "../../redux/snackbar.slice";
import firebase from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const db = firebase.firestore();

type IExerciseCard = {
  item?: Object | any;
  last?: boolean;
  toSave: string;
  fav: boolean;
};

const ExerciseCard = ({ item, last = false, toSave, fav }: IExerciseCard) => {
  const [hover, setHover] = useState(false);

  const dispatch = useDispatch();
  const userRedux = useSelector((state: any) => state.user.user);
  const exercisesRedux = useSelector((state: any) => state.exercises.exercises);
  const scheduleRedux = useSelector((state: any) => state.schedule.schedule);
  const exercisesRef = db.collection("favourites");
  const queryExercises = exercisesRef.orderBy("name");
  //@ts-ignore
  const [favouriteExercises] = useCollectionData(queryExercises, { id: "id" });

  async function getDocumentIdByFieldValue(field: string, value: any) {
    try {
      const querySnapshot = await db.collection("favourites").where(field, "==", value).get();
      if (querySnapshot.empty) {
        console.log(`No documents found with ${field} equal to ${value}.`);
        return null;
      } else {
        const document = querySnapshot.docs[0];
        console.log(`Document data:`, document.data());
        return document.id;
      }
    } catch (error) {
      console.error(`Error getting document with ${field} equal to ${value}:`, error);
      return null;
    }
  }

  const deleteRow = async () => {
    const actualID: any = await getDocumentIdByFieldValue("gifUrl", item.gifUrl);
    try {
      await db.collection("favourites").doc(actualID).delete();
      console.log(`Document with ID ${actualID} was successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting document with ID ${actualID}:`, error);
    }
    dispatch(
      setSnackbar({
        open: true,
        content: "You have successfully deleted the exercise from your favourites",
      })
    );
  };

  const handleClick = async () => {
    if (!fav) {
      {
        favouriteExercises &&
          (await exercisesRef.add({
            id: favouriteExercises.length + 1,
            gifUrl: item?.gifUrl,
            category: toSave,
            issuer: userRedux.issuer,
            name: item?.name,
          }));
      }
      dispatch(
        setSnackbar({
          open: true,
          content: "You have successfully added the exercise to your favourites",
        })
      );
      dispatch(setExercisesState({ ...exercisesRedux, exercises: !exercisesRedux?.exercises }));
    } else {
      await deleteRow();
      dispatch(setExercisesState({ ...exercisesRedux, exercises: !exercisesRedux?.exercises }));
    }
  };

  const addSchedule = () => {
    const gif = item?.gifUrl;
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
      <Image src={item?.gifUrl} alt="" layout="fill" />
      <motion.div
        className={styles.hoverContainer}
        animate={{ y: hover ? 0 : 280 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.exerciseName}>{item?.name}</h1>
        <ThemeProvider theme={exerciseButtonTheme}>
          <Button
            className={styles.addToFav}
            onClick={handleClick}
            label={<>{fav ? "Remove from favourites" : "Add to favourites"}</>}
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
