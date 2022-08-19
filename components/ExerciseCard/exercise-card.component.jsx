import styles from "../../css/components/ExerciseCard.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const ExerciseCard = ({ item, last = false }) => {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      className={last === true ? styles.lastExerciseCard : styles.exerciseCard}
      animate={{ scale: [0, 1] }}
      initial={{ scale: 0 }}
      transition={{ delay: 0.2 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image src={item.gifUrl} alt="" layout="fill" />
      <h1 className={styles.exerciseName}>{item.name}</h1>
    </motion.div>
  );
};

export default ExerciseCard;
