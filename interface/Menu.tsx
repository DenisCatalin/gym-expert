import React from "react";
import MuiMenu from "@mui/material/Menu";
import { ThemeProvider } from "@mui/material";
import { theme2 } from "../utils/muiTheme";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import { useSelector } from "react-redux";

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
  content?: string;
};

export const Menu = ({ id, anchor, handleClose, options, title, content }: IMenuProps) => {
  const open = Boolean(anchor);
  const userRedux = useSelector((state: any) => state.user.user);
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
              flexDirection: "column",
              width: "100%",
              height: "15vh",
              fontWeight: "bold",
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                position: "relative",
                marginBottom: "1rem",
              }}
            >
              <Image
                src={userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic}
                alt=""
                layout="fill"
                objectFit="cover"
                priority
                style={{ borderRadius: "50%" }}
                blurDataURL={
                  userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic
                }
              />
            </div>
            <div>{title}</div>
            <div style={{ fontWeight: "100", opacity: "0.8" }}>{content}</div>
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
