import styles from "../../../css/components/TeamProfile.module.css";
import Image from "next/image";
import { Button } from "../../../interface/Button";

type ITeamProfile = {
  image?: any;
};

const TeamProfile = ({ image }: ITeamProfile) => {
  return (
    <div className={styles.team} tabIndex={0}>
      <div className={styles.img}>
        <Image src={image} alt="" layout="fill" objectFit="cover" />
      </div>
      <div className={styles.info}>
        <div className={styles.name} tabIndex={0}>
          Denis Catalin
        </div>
        <div className={styles.title} tabIndex={0}>
          Web Developer
        </div>
        <div className={styles.social}>
          <Button
            color={"secondary"}
            className={styles.socialIcon}
            label={<Image src={"/static/facebook-dark.svg"} alt="" width="80" height="60" />}
            role="link"
            ariaLabel={"Facebook page"}
          />
          <Button
            color={"secondary"}
            className={styles.socialIcon}
            label={<Image src={"/static/instagram-dark.svg"} alt="" width="80" height="60" />}
            role="link"
            ariaLabel={"Instagram page"}
          />
          <Button
            color={"secondary"}
            className={styles.socialIcon}
            label={<Image src={"/static/twitter-dark.svg"} alt="" width="80" height="60" />}
            role="link"
            ariaLabel={"Twitter page"}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;
