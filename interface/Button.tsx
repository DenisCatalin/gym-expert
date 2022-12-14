import React from "react";
import MuiButton from "@mui/material/Button";

type IButtonProps = {
  key?: string;
  color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined;
  onClick?: () => void;
  autoFocus?: boolean;
  className?: string;
  label: string | React.ReactNode;
};

export const Button = ({ key, color, onClick, autoFocus, className, label }: IButtonProps) => {
  return (
    <MuiButton
      key={key}
      color={color}
      onClick={onClick}
      autoFocus={autoFocus ? true : false}
      className={className}
    >
      {label}
    </MuiButton>
  );
};
