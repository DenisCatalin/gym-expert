import React, { useContext, useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styles from "../../css/Profile.module.css";
import Image from "next/image";
import { Dialog } from "../../interface/Dialog";
import PhotoCrop from "./cropper/Cropper.c";
import { cropContext } from "../../lib/cropContext";
import { cropImages } from "../../lib/cropImages";
import { useSelector, useDispatch } from "react-redux";
import { setUserState } from "../../redux/user.slice";
import { setSnackbar } from "../../redux/snackbar.slice";
import fetchData from "../../utils/fetchData";
import { CircularProgress } from "@mui/material";
import { setOtherState } from "../../redux/others.slice";

const ProfilePic = () => {
  const [uploadData, setUploadData] = useState(false);
  const [hasImg, setHasImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cropImage, setCropImage } = useContext(cropContext);
  const userRedux = useSelector((state: any) => state.user.user);
  const otherRedux = useSelector((state: any) => state.other.other);
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
  }, [open]);

  useEffect(() => {
    if (otherRedux.loadingUpload) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [otherRedux]);

  const cropPhoto = async () => {
    if (
      userRedux.profilePic !== "" &&
      userRedux.logged &&
      userRedux.cropped === false &&
      cropImage !== null
    ) {
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

  const uploadPhoto = (e: React.ChangeEvent<HTMLFormElement>) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent: any) {
      setImgSrc(onLoadEvent.target.result);
      setUploadData(true);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const uploadFile = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      setOtherState({
        ...otherRedux,
        loadingUpload: true,
      })
    );

    const form = e.currentTarget;
    //@ts-ignore
    const fileInput = Array.from(form.elements).find(({ name }) => name === "file");

    const formData = new FormData();
    //@ts-ignore
    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "restaurant-app-profile-pics");

    await fetchData(`${process.env.NEXT_PUBLIC_FETCH_CROP_AREA}`, {
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
      const data = await fetchData(`${process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PHOTO}`, {
        method: "POST",
        body: formData,
      });

      await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPLOAD_PHOTO}`, {
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
          cropArea: cropImage,
          needsUpdate: true,
        })
      );
      dispatch(
        setSnackbar({
          open: true,
          content: "You have successfully uploaded your profile picture.",
        })
      );
      setUploadData(false);
      dispatch(
        setOtherState({
          ...otherRedux,
          loadingUpload: false,
        })
      );
    } else {
      setUploadData(false);
      handleClose();
      dispatch(setUserState({ ...userRedux, cropArea: cropImage }));
      cropPhoto();
      dispatch(
        setOtherState({
          ...otherRedux,
          loadingUpload: false,
        })
      );
    }
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
            blurDataURL={userRedux.profileAvatar ? userRedux.profileAvatar : userRedux.profilePic}
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
        title="Upload a profile picture"
        contentStyles={styles.dialogTitle}
        textStyles={styles.text}
        contentText="Choose a photo for your profile picture. You can crop it later."
        contentOther={
          <>
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
                          src={imgSrc !== undefined ? imgSrc : ""}
                          alt=""
                          layout="fill"
                          objectFit="cover"
                          priority
                          blurDataURL={imgSrc}
                        />
                      ) : (
                        <PhotoCrop image={imgSrc} />
                      )}
                    </div>
                    <button className={styles.upload}>
                      {loading ? <CircularProgress color="secondary" /> : "Save"}
                    </button>
                  </>
                ) : null}

                <label className={styles.upload}>
                  {loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <>
                      <input type="file" name="file" className={styles.uploadInput} />
                      Upload Photo <CloudUploadIcon />
                    </>
                  )}
                </label>
              </form>
            </div>
          </>
        }
      />
    </div>
  );
};

export default ProfilePic;
