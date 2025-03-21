import React from "react";
import MuiButton from "@mui/material/Button";
import MuiTooltip from "@mui/material/Tooltip";

export type IButtonProps = {
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | undefined;
  onClick?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  autoFocus?: boolean;
  className?: string;
  label: string | React.ReactNode;
  role?: string;
  ariaLabel?: string;
  tooltip: string;
  tooltipPlacement: "top" | "bottom" | "left" | "right";
  styles?: Object;
  disabled?: boolean;
};

export const IconButton = ({
  color,
  onClick,
  onKeyDown,
  autoFocus,
  className,
  label,
  role,
  ariaLabel,
  tooltip,
  tooltipPlacement,
  styles,
  disabled,
}: IButtonProps) => {
  return (
    <MuiTooltip title={tooltip} placement={tooltipPlacement}>
      <MuiButton
        color={color}
        onClick={onClick}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus ? true : false}
        className={className}
        role={role}
        aria-label={ariaLabel}
        style={styles}
        disabled={disabled}
      >
        {label}
      </MuiButton>
    </MuiTooltip>
  );
};
