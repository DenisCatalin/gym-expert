import Head from "next/head";
import styles from "../css/AdminPage.module.css";
import Header from "../components/Header/header.component";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import CustomSnackbar from "../components/Snackbar/snackbar.component";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect, useContext } from "react";
import { TextareaAutosize, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { userContext } from "../lib/userContext";
import { useSelector } from "react-redux";
import { ROUTES } from "../Routes";
import { MotionButton } from "../interface/MotionButton.tsx";
import { fetchData } from "../utils/fetchData.tsx";

const AdminPage = () => {
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [title, setTitle] = useState("");
  const [uploadData, setUploadData] = useState(false);
  const router = useRouter();
  const { user, setUser } = useContext(userContext);
  const [text, setText] = useState("");

  const userRedux = useSelector(state => state.user.user);

  let d = new Date();
  const currentMonth = d.getMonth();
  const currentDay = d.getDate();
  const currentYear = d.getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateString = `${months[currentMonth]}-${currentDay}-${currentYear}`;

  useEffect(() => {
    (async () => {
      if (userRedux.admin !== 1) router.push(ROUTES.homepage);
    })();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUploadData(false);
    setImgSrc();
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
    if (imgSrc !== null && text !== "" && title !== "") {
      const form = e.currentTarget;
      const fileInput = Array.from(form.elements).find(({ name }) => name === "file");

      const formData = new FormData();

      for (const file of fileInput.files) {
        formData.append("file", file);
      }

      formData.append("upload_preset", "restaurant-app-profile-pics");
      handleClose();
    }
  };

  useEffect(() => {
    async () => {
      if (uploadData === true) {
        await fetchData(`${process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PHOTO}`, {
          method: "POST",
          body: formData,
        });

        await fetchData(`${process.env.NEXT_PUBLIC_FETCH_POST_NEXT}`, {
          method: "POST",
          headers: {
            body: JSON.stringify({
              title: title,
              text: text,
              img: imgSrc,
              date: dateString,
            }),
          },
        });
      }
    };
  }, [uploadData]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Gym Expert - Homepage</title>
      </Head>
      <Header />
      <CustomSnackbar />
      <div className={styles.spacing}>
        <MotionButton
          hover={"boxShadow"}
          tap
          animateOptions={{ y: [-500, 0] }}
          initialOptions={{ y: 0 }}
          className={styles.mainButton2}
          onClick={handleClickOpen}
          label={"Post News"}
        />
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
          {"Upload a photo for your news post"}
        </DialogTitle>
        <DialogContent style={{ background: "var(--background)", height: "80vh" }}>
          <DialogContentText id="alert-dialog-description" className={styles.text}>
            {"Choose a picture. This picture will be used along with the news as the cover."}
          </DialogContentText>
          <div className={styles.uploadContainer}>
            <TextField
              id="outlined-basic"
              label="Title"
              variant="filled"
              color="secondary"
              style={{ width: "100%" }}
              onChange={e => setTitle(e.target.value)}
              className={styles.input}
              inputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="News text"
              variant="filled"
              style={{ height: "50%" }}
              onChange={e => setText(e.target.value)}
              className={styles.textarea}
            />
            <form
              onChange={uploadPhoto}
              className={styles.imageContainerModal}
              onSubmit={uploadFile}
            >
              {uploadData === true ? (
                <div className={styles.photoContainer}>
                  <Image src={imgSrc} alt="" layout="fill" objectFit="cover" />
                </div>
              ) : null}
              <label className={styles.upload}>
                <input type="file" name="file" className={styles.uploadInput} />
                Upload Photo <CloudUploadIcon />
              </label>
              <label className={styles.upload}>Post</label>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
