import styles from "../../css/components/ExerciseCard.module.css";
import Image from "next/image";
import { motion } from "framer-motion";

const ExerciseCard = ({ item, last = false }) => {
  console.log(last);
  return (
    <motion.div
      className={last === true ? styles.lastExerciseCard : styles.exerciseCard}
      animate={{ scale: [0, 1] }}
      initial={{ scale: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Image src={item.gifUrl} alt="" layout="fill" />
      <h1 className={styles.exerciseName}>{item.name}</h1>
    </motion.div>
  );
};

export default ExerciseCard;
