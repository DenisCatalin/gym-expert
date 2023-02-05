import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type IButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onKeyDown?: (event: any) => void;
  className?: string;
  label: string | React.ReactNode;
  hover?: string;
  tap?: boolean;
  initialOptions?: Object;
  animateOptions?: Object;
  style?: Object;
  disabled?: boolean;
  role?: string;
  ariaLabel?: string;
  tabIndex?: number;
};

export const MotionButton = ({
  onClick,
  onKeyDown,
  className,
  label,
  hover,
  tap,
  initialOptions,
  animateOptions,
  style,
  disabled,
  role,
  ariaLabel,
  tabIndex,
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
      onKeyDown={onKeyDown}
      className={className}
      whileHover={hoverOption}
      whileTap={tap ? { scale: 0.9 } : undefined}
      initial={initialOptions}
      animate={animateOptions}
      style={style}
      disabled={disabled}
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {label}
    </motion.button>
  );
};
