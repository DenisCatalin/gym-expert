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
import { snackbarContext } from "../../lib/snackbarContext";
import { useSelector, useDispatch } from "react-redux";
import { setCropAreaRedux, setProfilePicRedux } from "../../redux/user.slice";

const ProfilePic = () => {
  const { user, setUser } = useContext(userContext);
  const [uploadData, setUploadData] = useState(false);
  const [hasImg, setHasImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPhotoUrl, setCroppedPhotoUrl] = useState("");
  const [open, setOpen] = useState(false);
  const { cropImage, setCropImage } = useContext(cropContext);
  const [hasToClick, setHasToClick] = useState(false);
  const { snackbarContent, setSnackbarContent } = useContext(snackbarContext);
  const userRedux = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userRedux.logged) {
      setImgSrc(userRedux.profileAvatar);
      setHasImg(true);
      setCroppedAreaPixels(null);
      cropPhoto();
      // dispatch(setCropAreaRedux({ width: 1440, height: 1080, x: 240, y: 0 }));
    }
  }, [user, open, hasToClick]);

  const cropPhoto = async () => {
    if (
      userRedux.profilePic !== "" &&
      userRedux.logged &&
      userRedux.cropped === false &&
      userRedux.cropArea !== null
    ) {
      user.cropped = true;
      const img = await cropImages(userRedux.profilePic, userRedux.cropArea);
      setImgSrc(img);
      setCroppedPhotoUrl(img);
      dispatch(setProfilePicRedux(img));
    }
  };

  useEffect(() => {
    console.log("TEST", cropImage);
  }, [cropImage]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const uploadPhoto = (e) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImgSrc(onLoadEvent.target.result);
      setUploadData(true);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "restaurant-app-profile-pics");

    const res = await fetch("/api/croppedArea", {
      method: "POST",
      headers: {
        body: JSON.stringify({
          displayName: userRedux.displayName,
          cropArea: JSON.stringify(croppedAreaPixels),
        }),
      },
    });
    const response = await res.json();
    console.log(response);
    setSnackbarContent("You have successfully cropped your profile picture.");

    if (uploadData === true) {
      const data = await fetch(
        "https://api.cloudinary.com/v1_1/dgkdpysp5/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      const res = await fetch("/api/uploadPhoto", {
        method: "POST",
        headers: {
          body: JSON.stringify({
            displayName: userRedux.displayName,
            profilePic: data.secure_url,
            issuer: userRedux.issuer,
          }),
        },
      });

      dispatch(setProfilePicRedux(data.secure_url));
      dispatch(setProfileAvatarRedux(data.secure_url));

      const response = await res.json();
      setSnackbarContent(
        "You have successfully uploaded your profile picture."
      );
      console.log(response);
    }
    setUploadData(false);
    user.cropped = true;
    handleClose();
    cropPhoto();
  };

  const saveCropArea = () => {
    setCroppedAreaPixels(cropImage);
    dispatch(setCropAreaRedux(cropImage));
    dispatch(setProfilePicRedux(userRedux.profileAvatar));
    user.cropped = false;
    cropPhoto();
  };

  return (
    <div className={styles.profilePicContainer}>
      <div className={styles.profilePic} onClick={handleClickOpen}>
        {userRedux.profilePic !== null ? (
          <Image
            src={userRedux.profilePic}
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
          <DialogContentText
            id="alert-dialog-description"
            className={styles.text}
          >
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
                <button className={styles.buttonUpload} onClick={saveCropArea}>
                  Crop
                </button>
                <button
                  className={styles.buttonUpload}
                  onClick={() => {
                    setHasToClick(!hasToClick);
                  }}
                >
                  Reset
                </button>
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
                      <Image
                        src={imgSrc}
                        alt=""
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <PhotoCrop image={imgSrc} />
                    )}
                  </div>
                  <button className={styles.buttonUpload}>Save</button>
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
