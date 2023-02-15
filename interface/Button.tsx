import React from "react";
import MuiButton from "@mui/material/Button";

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
  onDoubleClick?: (event: any) => void;
  autoFocus?: boolean;
  className?: string;
  label: string | React.ReactNode;
  role?: string;
  ariaLabel?: string;
};

export const Button = ({
  color,
  onClick,
  onDoubleClick,
  autoFocus,
  className,
  label,
  role,
  ariaLabel,
}: IButtonProps) => {
  return (
    <MuiButton
      color={color}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      autoFocus={autoFocus ? true : false}
      className={className}
      role={role}
      aria-label={ariaLabel}
    >
      {label}
    </MuiButton>
  );
};
