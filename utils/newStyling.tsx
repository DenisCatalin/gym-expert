import * as React from "react";
import { IButtonProps, IconButton } from "../interface/IconButton";
import { styled } from "@mui/material/styles";

type Props = {
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
};

const SuccessSlider = styled(IconButton)<IButtonProps>(() => ({
  background: "var(--buttonGradient)",
  position: "absolute",
  top: "15%",
  right: "10%",
}));

export default function StyledCustomization({
  color,
  onClick,
  onKeyDown,
  autoFocus,
  label,
  role,
  ariaLabel,
  tooltip,
  tooltipPlacement,
}: Props) {
  return (
    <SuccessSlider
      tooltip={tooltip}
      tooltipPlacement={tooltipPlacement}
      label={label}
      color={color}
      onClick={onClick}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus ? true : false}
      role={role}
      aria-label={ariaLabel}
    />
  );
}
