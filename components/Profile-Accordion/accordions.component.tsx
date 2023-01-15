import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import styles from "../../css/components/Accordion.module.css";
import { useSelector } from "react-redux";
import { MotionTypo } from "../../interface/MotionTypo";
import Accordion from "./accordion.component";

const Accordions = () => {
  const userRedux = useSelector((state: any) => state.user.user);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {userRedux.secretKeyword === null ? <Accordion type="setKeyword" /> : null}
      <Accordion type="displayName" />
      <Accordion type="changeKeyword" />
      <Accordion type="subscription" />
      <MuiAccordion disabled className={styles.accordion}>
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
      </MuiAccordion>
    </div>
  );
};

export default Accordions;
