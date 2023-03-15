import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import styles from "../../css/components/Accordion.module.css";
import { useSelector } from "react-redux";
import { MotionTypo } from "../../interface/MotionTypo";
import { useState } from "react";
import SetKeywordAccordion from "./SetKeywordAccordion.c";
import ChangeKeywordAccordion from "./ChangeKeywordAccordion.c";
import ChangeNameAccordion from "./ChangeNameAccordion.c";
import ManageSubscriptionAccordion from "./ManageSubscriptionAccordion.c";

export type IAccordion = {
  ariaControls: string;
  name: string;
  handleChange: (
    panel: string
  ) => (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void;
  expanded: string | boolean;
};

const Accordions = () => {
  const userRedux = useSelector((state: any) => state.user.user);
  const [expanded, setExpanded] = useState<string | boolean>(false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div style={{ width: "100%", height: "100vh", zIndex: "3" }}>
      {userRedux.secretKeyword === null ? (
        <SetKeywordAccordion
          ariaControls="setKeyword"
          name="setKeyword"
          expanded={expanded}
          handleChange={handleChange}
        />
      ) : null}
      <ChangeNameAccordion
        ariaControls="displayName"
        name="displayName"
        expanded={expanded}
        handleChange={handleChange}
      />
      <ChangeKeywordAccordion
        ariaControls="changeKeyword"
        name="changeKeyword"
        expanded={expanded}
        handleChange={handleChange}
      />
      <ManageSubscriptionAccordion
        ariaControls="subscription"
        name="subscription"
        expanded={expanded}
        handleChange={handleChange}
      />
      {/* <Accordion
        type="subscription"
        ariaControls="subscription"
        name="hey"
        expanded={expanded}
        handleChange={handleChange}
      />
      <Accordion
        type="subscription"
        ariaControls="subscription"
        name="hey2"
        expanded={expanded}
        handleChange={handleChange}
      />
      <Accordion
        type="subscription"
        ariaControls="subscription"
        name="hey3"
        expanded={expanded}
        handleChange={handleChange}
      /> */}
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
