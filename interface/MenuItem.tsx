import React from "react";
import { ListItemIcon } from "@mui/material";
import MuiMenuItem from "@mui/material/MenuItem";

type MenuOptions = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  show?: boolean;
  refElem?: any;
};

export const MenuItem = ({ key, label, icon, onClick, show, refElem }: MenuOptions) => {
  return (
    <>
      {show ? (
        <MuiMenuItem onClick={onClick} key={key} role="link" ref={refElem}>
          <ListItemIcon>{icon}</ListItemIcon>
          {label}
        </MuiMenuItem>
      ) : null}
    </>
  );
};
