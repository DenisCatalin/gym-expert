import React from "react";
import styles from "../../../css/components/TestimonialsCardResponsive.module.css";
import { ratingLabels } from "../../../lib/ratingLabels";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import Image from "next/image";

const theme2 = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#434343",
      darker: "#434343",
    },
    neutral: {
      main: "#EEE",
      contrastText: "#EEE",
    },
    dark: {
      main: "#434343",
      contrastText: "#434343",
    },
  },
});

const ResponsiveCard = ({ profilePic, name, date, text, rating }) => {
  const { width } = useWindowDimensions();
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.profilePic}>
          <Image
            src={"/static/test.jpg"}
            alt=""
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.userName}>{name}</h1>
          <h3 className={styles.date}>{date}</h3>
        </div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.testimonial}>{text}</h1>
      </div>
      <div className={styles.rating}>
        <Rating
          name="text-feedback"
          value={rating}
          readOnly
          precision={0.5}
          size={width > 920 ? "large" : "medium"}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Box sx={{ ml: 2 }}>{ratingLabels[rating]}</Box>
      </div>
    </div>
  );
};

export default ResponsiveCard;
