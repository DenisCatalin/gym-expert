import React from "react";
import MuiButton from "@mui/material/Button";
import MuiTooltip from "@mui/material/Tooltip";

type IButtonProps = {
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
  autoFocus?: boolean;
  className?: string;
  label: string | React.ReactNode;
  role?: string;
  ariaLabel?: string;
  tooltip: string;
};

export const IconButton = ({
  color,
  onClick,
  autoFocus,
  className,
  label,
  role,
  ariaLabel,
  tooltip,
}: IButtonProps) => {
  return (
    <MuiTooltip title={tooltip}>
      <MuiButton
        color={color}
        onClick={onClick}
        autoFocus={autoFocus ? true : false}
        className={className}
        role={role}
        aria-label={ariaLabel}
      >
        {label}
      </MuiButton>
    </MuiTooltip>
  );
};
