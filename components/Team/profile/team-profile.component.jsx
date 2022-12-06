import styles from "../../../css/components/TeamProfile.module.css";
import Image from "next/image";

const TeamProfile = ({ image }) => {
  return (
    <div className={styles.team}>
      <div className={styles.img}>
        <Image src={image} alt="" layout="fill" objectFit="cover" />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>Denis Catalin</div>
        <div className={styles.title}>Web Developer</div>
        <div className={styles.social}>
          <button className={styles.socialIcon}>
            <Image src={"/static/facebook-dark.svg"} alt="" width="150" height="150" />
          </button>
          <button className={styles.socialIcon}>
            <Image src={"/static/instagram-dark.svg"} alt="" width="150" height="150" />
          </button>
          <button className={styles.socialIcon}>
            <Image src={"/static/twitter-dark.svg"} alt="" width="150" height="150" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;
