import React from "react";
import { ListItemIcon } from "@mui/material";
import MuiMenuItem from "@mui/material/MenuItem";

type MenuOptions = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  show?: boolean;
};

export const MenuItem = ({ key, label, icon, onClick, show }: MenuOptions) => {
  return (
    <>
      {show ? (
        <MuiMenuItem onClick={onClick} key={key}>
          <ListItemIcon>{icon}</ListItemIcon>
          {label}
        </MuiMenuItem>
      ) : null}
    </>
  );
};
