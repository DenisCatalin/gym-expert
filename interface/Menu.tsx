import React from "react";
import MuiMenu from "@mui/material/Menu";
import { ThemeProvider } from "@mui/material";
import { theme2 } from "../utils/muiTheme";
import { MenuItem } from "./MenuItem.tsx";

export type MenuOptions = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  show: boolean;
};

type IMenuProps = {
  id: string;
  anchor: HTMLElement | null;
  handleClose: () => void;
  options: MenuOptions[];
  title?: string;
};

export const Menu = ({ id, anchor, handleClose, options, title }: IMenuProps) => {
  const open = Boolean(anchor);
  return (
    <MuiMenu
      anchorEl={anchor}
      id={id}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          color: "white",
          cursor: "pointer",
          background: "linear-gradient(334.52deg, #E87BFF 0%, #622CCE 100%)",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <ThemeProvider theme={theme2}>
        {title ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "8vh",
              fontWeight: "bold",
            }}
          >
            {title}
          </div>
        ) : null}
        {options.map(option => (
          <MenuItem
            key={option.key}
            label={option.label}
            icon={option.icon}
            onClick={option.onClick}
            show={option.show}
          />
        ))}
      </ThemeProvider>
    </MuiMenu>
  );
};
