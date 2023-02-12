import React from "react";
import MuiDialog from "@mui/material/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogContentText from "@mui/material/DialogContentText";
import MuiDialogTitle from "@mui/material/DialogTitle";

type IDialogProps = {
  fullWidth?: boolean;
  maxWidth?: false | undefined;
  open: boolean;
  onClose: () => void;
  title: string;
  contentStyles?: string;
  contentText?: string;
  textStyles?: string;
  contentOther?: React.ReactNode;
  actions?: React.ReactNode;
};

export const Dialog = ({
  fullWidth,
  maxWidth,
  open,
  onClose,
  title,
  contentStyles,
  contentText,
  textStyles,
  contentOther,
  actions,
}: IDialogProps) => {
  return (
    <MuiDialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <MuiDialogTitle id="alert-dialog-title" className={contentStyles}>
        {title}
      </MuiDialogTitle>
      <MuiDialogContent className={contentStyles}>
        <MuiDialogContentText id="alert-dialog-description" className={textStyles}>
          {contentText}
        </MuiDialogContentText>
        {contentOther ? <>{contentOther}</> : null}
      </MuiDialogContent>
      <MuiDialogActions className={contentStyles}>{actions}</MuiDialogActions>
    </MuiDialog>
  );
};
