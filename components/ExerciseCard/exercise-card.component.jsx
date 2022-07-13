import styles from "../../css/components/ExerciseCard.module.css";
import Image from "next/image";

const ExerciseCard = ({ item }) => {
  console.log(item);
  return (
    <div className={styles.exerciseCard}>
      <Image src={item.gifUrl} alt="" layout="fill" />
      <h1 className={styles.exerciseName}>{item.name}</h1>
    </div>
  );
};

export default ExerciseCard;
