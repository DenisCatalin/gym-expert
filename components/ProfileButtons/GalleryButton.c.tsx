import { useState } from "react";
import styles from "../../css/components/GalleryButton.module.css";
import { Dialog } from "../../interface/Dialog";
import { IconButton } from "../../interface/IconButton";
import { tooltipTheme } from "../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import { Button } from "../../interface/Button";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../redux/snackbar.slice";
import GalleryButtonIcon from "../../styles/GalleryButtonIcon.style";
import AddPhotoAlternateRounded from "@mui/icons-material/AddPhotoAlternateRounded";
import fetchData from "../../utils/fetchData";
import { setUserState } from "../../redux/user.slice";
import Image from "next/image";

const GalleryButton = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentPhoto, setCurrentPhoto] = useState<string>("");
  const [viewDialog, setViewDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const userRedux = useSelector((state: any) => state.user.user);
  const { issuer, gallery } = userRedux;
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLFormElement>) => {
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);
    setIsLoading(true);
    await uploadFile(e);
  };

  const uploadFile = async (e: React.SyntheticEvent) => {
    const form = e.currentTarget;
    //@ts-ignore
    const fileInput = Array.from(form.elements).find(({ name }) => name === "file");

    const formData = new FormData();
    //@ts-ignore
    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "restaurant-app-profile-pics");

    const data = await fetchData(`${process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PHOTO}`, {
      method: "POST",
      body: formData,
    });

    dispatch(
      setUserState({
        ...userRedux,
        gallery: gallery === null ? [data.secure_url] : [...gallery, data.secure_url],
        needsUpdate: true,
      })
    );

    await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_USERS_GALLERY}`, {
      method: "POST",
      headers: {
        body: JSON.stringify({
          gallery: gallery === null ? [data.secure_url] : [...gallery, data.secure_url],
          issuer: userRedux.issuer,
        }),
      },
    });

    dispatch(
      setUserState({
        ...userRedux,
        gallery: gallery === null ? [data.secure_url] : [...gallery, data.secure_url],
        needsUpdate: true,
      })
    );
    dispatch(
      setSnackbar({
        open: true,
        content: "Photo successfully added to your gallery",
      })
    );
    setIsLoading(false);
  };

  const openViewDialog = (photo: string) => {
    setViewDialog(true);
    setCurrentPhoto(photo);
  };

  const closeViewDialog = () => {
    setViewDialog(false);
  };

  const deleteFromGallery = async () => {
    const newGallery = gallery.filter((photo: any) => photo !== currentPhoto);

    await fetchData(`${process.env.NEXT_PUBLIC_FETCH_UPDATE_USERS_GALLERY}`, {
      method: "POST",
      headers: {
        body: JSON.stringify({
          gallery: newGallery.length === 0 ? null : newGallery,
          issuer: userRedux.issuer,
        }),
      },
    });

    dispatch(
      setUserState({
        ...userRedux,
        gallery: newGallery.length === 0 ? null : newGallery,
        needsUpdate: true,
      })
    );
    dispatch(
      setSnackbar({
        open: true,
        content: "Photo successfully deleted the photo from your gallery",
      })
    );
    closeViewDialog();
    closeDeleteDialog();
  };

  const openDeleteDialog = () => {
    setDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(false);
  };

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <GalleryButtonIcon
          color="secondary"
          label={
            <>
              <CollectionsRoundedIcon htmlColor="#fff" />
            </>
          }
          role="button"
          ariaLabel="Gallery"
          className={styles.galleryButton}
          tooltip="Gallery"
          tooltipPlacement="left"
          onClick={handleOpen}
          disabled={isLoading ? true : false}
        />
      </ThemeProvider>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        title={
          <>
            <div className={styles.dialogTitle}>
              <p>Your gallery</p>
              <form onChange={uploadPhoto}>
                <label htmlFor="upload">
                  <ThemeProvider theme={tooltipTheme}>
                    <IconButton
                      label={
                        <>
                          <AddPhotoAlternateRounded htmlColor="#fff" />
                        </>
                      }
                      tooltip="Add Photo"
                      tooltipPlacement="bottom"
                      className={styles.galleryUpload}
                      color="secondary"
                    />
                  </ThemeProvider>
                  {isLoading ? null : (
                    <input id="upload" type="file" name="file" className={styles.uploadInput} />
                  )}
                </label>
              </form>
            </div>
          </>
        }
        fullWidth={true}
        maxWidth={"xl"}
        textStyles={styles.text}
        contentStyles={styles.background}
        contentOther={
          <>
            <div className={styles.dates}>
              {gallery &&
                gallery.map((photo: any) => (
                  <div className={styles.photoGallery}>
                    <Image
                      src={photo}
                      alt=""
                      layout="fill"
                      className={styles.galleryPhoto}
                      onClick={() => openViewDialog(photo)}
                    />
                  </div>
                ))}
            </div>
          </>
        }
        actions={
          <>
            <Button label="Close" color="secondary" onClick={handleClose} />
          </>
        }
      />
      <Dialog
        open={viewDialog}
        onClose={closeViewDialog}
        title={"View photo"}
        fullWidth={true}
        maxWidth={"xl"}
        textStyles={styles.text}
        contentStyles={styles.backgroundView}
        contentOther={
          <>
            <Image src={currentPhoto} alt="" layout="fill" className={styles.galleryPhoto} />
          </>
        }
        actions={
          <>
            <Button label="Delete" color="warning" onClick={openDeleteDialog} />
            <Button label="Close" color="warning" onClick={closeViewDialog} />
          </>
        }
      />
      <Dialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
        title={"Delete photo"}
        fullWidth={true}
        maxWidth={"sm"}
        textStyles={styles.text}
        contentStyles={styles.background}
        contentText="Are you sure you want to delete this photo from your gallery?"
        actions={
          <>
            <Button label="No" color="secondary" onClick={closeDeleteDialog} />
            <Button label="Yes" color="secondary" onClick={deleteFromGallery} />
          </>
        }
      />
    </>
  );
};

export default GalleryButton;
