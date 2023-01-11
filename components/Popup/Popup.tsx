import React, { useState } from "react";
import { Dialog } from "../../interface/Dialog.tsx";
import { Button } from "../../interface/Button.tsx";
import { useSelector, useDispatch } from "react-redux";
import { setOtherState } from "../../redux/others.slice";

type IPopup = {
  popupFor?: string;
  title: string;
  contentStyles?: string;
  textStyles?: string;
  contentText: string;
  contentOther?: Object | React.ReactNode;
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
