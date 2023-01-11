import ChangeDisplayName from "./accordion-items/change-display-name.component";
import ChangeSecretKeyword from "./accordion-items/change-secret-keyword.component";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import styles from "../../css/components/Accordion.module.css";
import Subscription from "./accordion-items/subscription.component";
import SetSecretKey from "./accordion-items/set-secret-keyword.component";
import { useSelector } from "react-redux";
import { MotionTypo } from "../../interface/MotionTypo";

const AccordionProfile = () => {
  const userRedux = useSelector(state => state.user.user);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {userRedux.secretKeyword === null ? <SetSecretKey /> : null}
      <ChangeDisplayName />
      <ChangeSecretKeyword />
      <Subscription />
      <Accordion disabled className={styles.accordion}>
        <AccordionSummary
          aria-controls="panel3a-content"
          id="panel3a-header"
          style={{
            opacity: 1,
          }}
        >
          <div className={styles.spacer}>
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content="Member Since"
            />
            <MotionTypo
              className={styles.text}
              animateOptions="opacityScale"
              content={<>{userRedux.memberSince}</>}
            />
          </div>
        </AccordionSummary>
      </Accordion>
    </div>
  );
};

export default AccordionProfile;
