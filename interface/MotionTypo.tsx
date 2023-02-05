import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type IMotionOptions = {
  className?: string;
  animateOptions?:
    | "opacity"
    | "fromTopL"
    | "fromTopN"
    | "fromBottomL"
    | "fromBottomN"
    | "fromRightL"
    | "fromRightN"
    | "fromLeftL"
    | "fromLeftN"
    | "opacityScale";
  transitionDuration?: number;
  initialOptions?: Object;
  content?: string | React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (event: any) => void;
};

export const MotionTypo = ({
  className,
  animateOptions,
  transitionDuration,
  content,
  initialOptions,
  onClick,
  onKeyDown,
}: IMotionOptions) => {
  const [animate, setAnimate] = useState<any>({});

  useEffect(() => {
    switch (animateOptions) {
      case "opacity": {
        setAnimate({ opacity: [0, 1] });
        break;
      }
      case "fromTopL": {
        setAnimate({ y: [-500, 0] });
        break;
      }
      case "fromTopN": {
        setAnimate({ y: [-200, 0] });
        break;
      }
      case "fromBottomL": {
        setAnimate({ y: [500, 0] });
        break;
      }
      case "fromBottomN": {
        setAnimate({ y: [200, 0] });
        break;
      }
      case "fromRightL": {
        setAnimate({ x: [-500, 0] });
        break;
      }
      case "fromRightN": {
        setAnimate({ x: [-200, 0] });
        break;
      }
      case "fromLeftL": {
        setAnimate({ x: [500, 0] });
        break;
      }
      case "fromLeftN": {
        setAnimate({ x: [200, 0] });
        break;
      }
      case "opacityScale": {
        setAnimate({ opacity: [0, 1], scale: [0.5, 1] });
        break;
      }
      default: {
        setAnimate({ x: [0, 0], y: [0, 0] });
        break;
      }
    }
  }, [animateOptions]);
  return (
    <motion.h1
      className={className}
      animate={animate}
      initial={initialOptions}
      transition={{ duration: transitionDuration }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {content}
    </motion.h1>
  );
};
