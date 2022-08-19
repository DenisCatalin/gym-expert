import ChangeDisplayName from "./accordion-items/change-display-name.component";
import ChangeSecretKeyword from "./accordion-items/change-secret-keyword.component";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import styles from "../../css/components/Accordion.module.css";
import Subscription from "./accordion-items/subscription.component";
import { useContext } from "react";
import { userContext } from "../../lib/userContext";
import SetSecretKey from "./accordion-items/set-secret-keyword.component";

const AccordionProfile = () => {
  const { user, setUser } = useContext(userContext);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {user.secretKeyword === null ? <SetSecretKey /> : null}
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
            sx={{ width: "92%", flexShrink: 0 }}
            className={styles.text}
          >
            Member Since
          </Typography>
          <Typography className={styles.text}>{user.memberSince}</Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
};

export default AccordionProfile;
