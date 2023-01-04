import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type IButtonProps = {
  onClick?: () => void;
  className?: string;
  label: string | React.ReactNode;
  hover?: string;
  tap?: boolean;
  initialOptions?: Object;
  animateOptions?: Object;
  style?: Object;
};

export const MotionButton = ({
  onClick,
  className,
  label,
  hover,
  tap,
  initialOptions,
  animateOptions,
  style,
}: IButtonProps) => {
  const [hoverOption, setHoverOption] = useState<any>({});

  useEffect(() => {
    switch (hover) {
      case "boxShadow": {
        setHoverOption({
          boxShadow: "0px 0px 10px rgba(220, 130, 242, .65)",
        });
        break;
      }
      case "opacity": {
        setHoverOption({ opacity: 0.75 });
        break;
      }
      case "scale": {
        setHoverOption({ scale: 1.05 });
        break;
      }
      default: {
        setHoverOption({});
      }
    }
  }, [hover]);

  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileHover={hoverOption}
      whileTap={tap ? { scale: 0.9 } : undefined}
      initial={initialOptions}
      animate={animateOptions}
      style={style}
    >
      {label}
    </motion.button>
  );
};
