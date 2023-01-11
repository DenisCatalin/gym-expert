import React, { useState } from "react";
import { Dialog } from "../../interface/Dialog";
import { Button } from "../../interface/Button";
import { useSelector, useDispatch } from "react-redux";
import { setOtherState } from "../../redux/others.slice";

type IPopup = {
  popupFor?: string;
  title: string;
  contentStyles?: string;
  textStyles?: string;
  contentText: string;
  contentOther?: React.ReactNode;
  onClickPositive?: () => void;
};

const Popup = ({
  popupFor,
  title,
  contentStyles,
  textStyles,
  contentText,
  contentOther,
  onClickPositive,
}: IPopup) => {
  const [open, setOpen] = useState(true);
  const otherRedux = useSelector((state: any) => state.other.other);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    switch (popupFor) {
      case "newUser": {
        dispatch(
          setOtherState({
            ...otherRedux,
            popup: true,
          })
        );
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        title={title}
        contentStyles={contentStyles}
        textStyles={textStyles}
        contentText={contentText}
        contentOther={contentOther}
        actions={
          <>
            <Button color="secondary" onClick={handleClose} label="No" />
            <Button color="secondary" onClick={onClickPositive} autoFocus={true} label="Yes" />
          </>
        }
      />
    </>
  );
};

export default Popup;
