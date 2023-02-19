import React from "react";
import TextField from "@mui/material/TextField";

type IInput = {
  label: string;
  color: "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined;
  type: string;
  className?: string;
  value: string | number | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: "standard" | "filled" | "outlined" | undefined;
};

const Input = ({ label, color, type, className, value, onChange, variant }: IInput) => {
  return (
    <>
      <TextField
        label={label}
        id={label}
        color={color}
        type={type}
        className={className}
        value={value}
        variant={variant}
        inputProps={{
          style: {
            color: "white",
            borderRadius: "5px",
          },
        }}
        onChange={onChange}
        InputLabelProps={{ style: { color: "white" } }}
      />
    </>
  );
};

export default Input;
