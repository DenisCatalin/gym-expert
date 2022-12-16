import React from "react";
import MuiButton from "@mui/material/Button";

type IButtonProps = {
  color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined;
  onClick?: () => void;
  autoFocus?: boolean;
  className?: string;
  label: string | React.ReactNode;
};

export const Button = ({ color, onClick, autoFocus, className, label }: IButtonProps) => {
  return (
    <MuiButton
      color={color}
      onClick={onClick}
      autoFocus={autoFocus ? true : false}
      className={className}
    >
      {label}
    </MuiButton>
  );
};
