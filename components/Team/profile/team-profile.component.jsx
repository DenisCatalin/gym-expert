import styles from "../../../css/components/TeamProfile.module.css";
import Image from "next/image";
import { Button } from "../../../interface/Button";

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
          <Button
            color={"secondary"}
            className={styles.socialIcon}
            label={<Image src={"/static/facebook-dark.svg"} alt="" width="80" height="60" />}
          />
          <Button
            color={"secondary"}
            className={styles.socialIcon}
            label={<Image src={"/static/instagram-dark.svg"} alt="" width="80" height="60" />}
          />
          <Button
            color={"secondary"}
            className={styles.socialIcon}
            label={<Image src={"/static/twitter-dark.svg"} alt="" width="80" height="60" />}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;
