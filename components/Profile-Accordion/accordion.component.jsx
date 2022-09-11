import ChangeDisplayName from "./accordion-items/change-display-name.component";
import ChangeSecretKeyword from "./accordion-items/change-secret-keyword.component";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import styles from "../../css/components/Accordion.module.css";
import Subscription from "./accordion-items/subscription.component";
import SetSecretKey from "./accordion-items/set-secret-keyword.component";
import { useSelector } from "react-redux";

const AccordionProfile = () => {
  const userRedux = useSelector((state) => state.user);
  console.log(userRedux.secretKeyword);
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
          style={{ opacity: 1 }}
        >
          <Typography
            sx={{ width: "85%", flexShrink: 0 }}
            className={styles.text}
          >
            Member Since
          </Typography>
          <Typography className={styles.text}>
            {userRedux.memberSince}
          </Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
};

export default AccordionProfile;
