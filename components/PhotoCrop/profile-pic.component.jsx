import { useContext, useState, useEffect } from "react";
import { userContext } from "../../lib/userContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styles from "../../css/Profile.module.css";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PhotoCrop from "./cropper/cropper.component";
import { cropContext } from "../../lib/cropContext";
import { cropImages } from "../../lib/cropImages";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../redux/user.slice";
import { setSnackbar } from "../../redux/snackbar.slice";
import { Button } from "../../interface/Button.tsx";
import useFetch from "../../utils/useFetch.tsx";

const ProfilePic = () => {
  const { user, setUser } = useContext(userContext);
  const [uploadData, setUploadData] = useState(false);
  const [hasImg, setHasImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [open, setOpen] = useState(false);
  const { cropImage, setCropImage } = useContext(cropContext);
  const [cropReset, setCropReset] = useState(false);
  const userRedux = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userRedux.logged) {
      setImgSrc(userRedux.profilePic);
      setHasImg(true);
      if (cropImage === null) {
        dispatch(
          setUserState({ ...userRedux, cropArea: { width: 1440, height: 1080, x: 240, y: 0 } })
        );
        cropPhoto();
      }
    }
  }, [user, open, cropReset]);

  const cropPhoto = async () => {
    if (
      userRedux.profilePic !== "" &&
      userRedux.logged &&
      userRedux.cropped === false &&
      cropImage !== null
    ) {
      user.cropped = true;
      const img = await cropImages(userRedux.profilePic, cropImage);
      setImgSrc(img);
      dispatch(setUserState({ ...userRedux, profileAvatar: img }));
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const uploadPhoto = e => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImgSrc(onLoadEvent.target.result);
      setUploadData(true);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const uploadFile = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === "file");

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "restaurant-app-profile-pics");

    await useFetch(`${process.env.NEXT_PUBLIC_FETCH_CROP_AREA}`, {
      method: "POST",
      headers: {
        body: JSON.stringify({
          displayName: userRedux.displayName,
          issuer: userRedux.issuer,
          cropArea: JSON.stringify(cropImage),
        }),
      },
    });
    dispatch(
      setSnackbar({
        open: true,
        content: "You have successfully cropped your profile picture.",
      })
    );

    if (uploadData === true) {
      const data = await useFetch(`${process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PHOTO}`, {
        method: "POST",
        body: formData,
      });

      await useFetch(`${process.env.NEXT_PUBLIC_FETCH_UPLOAD_PHOTO}`, {
        method: "POST",
        headers: {
          body: JSON.stringify({
            displayName: userRedux.displayName,
            profilePic: data.secure_url,
            issuer: userRedux.issuer,
          }),
        },
      });

      dispatch(
        setUserState({
          ...userRedux,
          profilePic: data.secure_url,
          profileAvatar: data.secure_url,
          needsUpdate: true,
        })
      );
      dispatch(
        setSnackbar({
          open: true,
          content: "You have successfully uploaded your profile picture.",
        })
      );
    }
    setUploadData(false);
    user.cropped = true;
    handleClose();
    dispatch(setUserState({ ...userRedux, cropArea: cropImage }));
    cropPhoto();
  };

  const resetCrop = () => {
    setCropReset(!cropReset);
  };

  return (
    <div className={styles.profilePicContainer}>
      <div className={styles.profilePic} onClick={handleClickOpen}>
        {userRedux.profilePic !== null ? (
          <Image
            src={userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic}
            alt=""
            layout="fill"
            objectFit="cover"
            priority
          />
        ) : (
          <>
            <h1 className={styles.text}>No Photo</h1>
            <h1 className={styles.text}>Click to upload</h1>
          </>
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            color: "var(--white)",
            fontFamily: "var(--font)",
            textAlign: "center",
            background: "var(--background)",
          }}
        >
          {"Upload a profile picture"}
        </DialogTitle>
        <DialogContent style={{ background: "var(--background)" }}>
          <DialogContentText id="alert-dialog-description" className={styles.text}>
            Choose a photo for your profile picture. You can crop it later.
          </DialogContentText>
          {uploadData ? null : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Button className={styles.buttonUpload} onClick={resetCrop} label={"Reset"} />
              </div>
            </>
          )}
          <div className={styles.uploadContainer}>
            <form
              onChange={uploadPhoto}
              className={styles.imageContainerModal}
              onSubmit={uploadFile}
            >
              {hasImg ? (
                <>
                  <div className={styles.imageHolder}>
                    {uploadData ? (
                      <Image src={imgSrc} alt="" layout="fill" objectFit="cover" />
                    ) : (
                      <PhotoCrop image={imgSrc} />
                    )}
                  </div>
                  <button className={styles.upload}>Save</button>
                </>
              ) : null}

              <label className={styles.upload}>
                <input type="file" name="file" className={styles.uploadInput} />
                Upload Photo <CloudUploadIcon />
              </label>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePic;
