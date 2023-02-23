import { useState } from "react";
import styles from "../../css/components/NutritionButton.module.css";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { Dialog } from "../../interface/Dialog";
import { IconButton } from "../../interface/IconButton";
import {
  dateContainer,
  dateContainerCurrent,
  inputTheme,
  tooltipTheme,
} from "../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import { Button } from "../../interface/Button";
import moment from "moment";
import FreeBreakfastRoundedIcon from "@mui/icons-material/FreeBreakfastRounded";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "../../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../interface/Table";
import { setSnackbar } from "../../redux/snackbar.slice";
import { setNutrition } from "../../redux/nutrition.slice";
import Input from "../../interface/Input";

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

const NutritionButton = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openNutrition, setOpenNutrition] = useState<boolean>(false);
  const [titleNutrition, setTitleNutrition] = useState<string>("Hey");
  const [quantity, setQuantity] = useState<number>(0);
  const [dayNow, setDayNow] = useState<number>(0);
  const [meal, setMeal] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [nutrients, setNutrients] = useState<string>("");
  const [macronutrients, setMacronutrients] = useState<string>("");

  const userRedux = useSelector((state: any) => state.user.user);
  const nutritionRedux = useSelector((state: any) => state.nutrition.nutrition);
  const { issuer } = userRedux;
  const dispatch = useDispatch();

  const firestore = firebase.firestore();
  const nutritionRef = firestore.collection("nutrition");
  const queryQ = nutritionRef.orderBy("createdAt");
  //@ts-ignore
  const [messages] = useCollectionData(queryQ, { id: "id" });

  let array: any = [];

  messages?.map(message => {
    if (
      message.sender === issuer &&
      message.day === nutritionRedux.day &&
      message.month === nutritionRedux.month
    ) {
      array.push(message);
    }
  });

  const fullDays: any = [];

  const getDayNames = (month: number, year: number) => {
    const daysInMonth = moment(`${month}-01-${year}`, "MM-DD-YYYY").daysInMonth();

    for (let i = 1; i <= daysInMonth; i++) {
      let date = moment(`${month}-${i}-${year}`, "MM-DD-YYYY");
      let dayName = date.format("dddd");

      fullDays.push(`${dayName}`);
    }

    return fullDays;
  };

  const d = new Date();
  const month = d.getMonth();
  const year = d.getFullYear();
  const currentDay = d.getDate();

  getDayNames(month + 1, year);

  const setupDialog = (day: number) => {
    setOpenNutrition(true);
    setDayNow(day);
    setTitleNutrition(
      `${currentDay === day ? "Add" : "Check"} nutrition for ${day} ${months[month]}`
    );

    dispatch(
      setNutrition({
        ...nutritionRedux,
        day: day,
        month: months[month],
      })
    );
  };

  const closeNutrition = () => {
    setOpenNutrition(false);
    clearNutrition();
  };

  const clearNutrition = () => {
    setMeal("");
    setCalories("");
    setNutrients("");
    setMacronutrients("");
    setQuantity(0);
  };

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const decreaseQuantity = () => {
    if (quantity === 0) return;
    else {
      setQuantity(quantity - 250);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 250);
  };

  const addDetails = async () => {
    dispatch(
      setSnackbar({
        open: true,
        content: "Nutrition successfully added",
      })
    );

    {
      messages &&
        (await nutritionRef.add({
          id: messages.length + 1,
          day: dayNow,
          month: months[month],
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          sender: issuer,
          mealName: meal,
          calories: calories,
          nutrients: nutrients,
          macronutrients: macronutrients,
          water: quantity,
        }));
    }
    clearNutrition();
  };

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <IconButton
          color="secondary"
          label={
            <>
              <LocalDiningIcon htmlColor="#fff" />
            </>
          }
          role="button"
          ariaLabel="Nutrition tracking"
          className={styles.nutritionButton}
          tooltip="Nutrition tracking"
          tooltipPlacement="right"
          onClick={handleOpen}
        />
      </ThemeProvider>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        title={`Pick a date - ${months[month]}`}
        fullWidth={true}
        maxWidth={"xl"}
        textStyles={styles.text}
        contentStyles={styles.background}
        contentOther={
          <>
            <div className={styles.dates}>
              {fullDays.map((day: any, i: number) => (
                <ThemeProvider
                  theme={currentDay === i + 1 ? dateContainerCurrent : dateContainer}
                  key={i}
                >
                  <Button
                    color="inherit"
                    label={
                      <>
                        <h4 style={{ fontSize: ".9em" }}>{i + 1}</h4>
                        <h4 style={{ fontSize: ".65em" }}>{day}</h4>
                      </>
                    }
                    onClick={() => setupDialog(i + 1)}
                    key={i}
                  />
                </ThemeProvider>
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
        fullWidth={true}
        maxWidth={"md"}
        open={openNutrition}
        onClose={closeNutrition}
        title={titleNutrition}
        textStyles={styles.text}
        contentStyles={styles.background}
        contentOther={
          <>
            <h1 className={styles.text}>
              Here you can track your calories, nutrients, macronutrients and how much water do you
              drink in a day.
            </h1>
            {currentDay === dayNow ? (
              <>
                <ThemeProvider theme={inputTheme}>
                  <div className={styles.inputs}>
                    <Input
                      label={"Meal (Optional)"}
                      color={"secondary"}
                      type="text"
                      className={styles.textField}
                      value={meal}
                      onChange={(e: any) => setMeal(e.target.value)}
                    />
                    <Input
                      label={"Calories (Optional)"}
                      color={"secondary"}
                      type="text"
                      className={styles.textField}
                      value={calories}
                      onChange={(e: any) => setCalories(e.target.value)}
                    />
                    <Input
                      label={"Nutrients (Optional)"}
                      color={"secondary"}
                      type="text"
                      className={styles.textField}
                      value={nutrients}
                      onChange={(e: any) => setNutrients(e.target.value)}
                    />
                    <Input
                      label={"Macronutrients (Optional)"}
                      color={"secondary"}
                      type="text"
                      className={styles.textField}
                      value={macronutrients}
                      onChange={(e: any) => setMacronutrients(e.target.value)}
                    />
                    <div className={styles.glassContainer}>
                      <span className={styles.increaseDecrease} onClick={decreaseQuantity}>
                        <RemoveIcon htmlColor="var(--background)" />
                      </span>
                      <div className={styles.glass}>
                        <FreeBreakfastRoundedIcon
                          htmlColor="var(--water)"
                          className={styles.glassIcon}
                        />
                        <p className={styles.waterQuantity}>{quantity}g</p>
                      </div>
                      <span className={styles.increaseDecrease} onClick={increaseQuantity}>
                        <AddIcon htmlColor="var(--background)" />
                      </span>
                    </div>
                    <ThemeProvider theme={tooltipTheme}>
                      <IconButton
                        color="secondary"
                        label={
                          <>
                            <SendRoundedIcon htmlColor="#fff" />
                          </>
                        }
                        tooltip="Add details"
                        tooltipPlacement="right"
                        onClick={addDetails}
                        className={styles.addDetails}
                      />
                    </ThemeProvider>
                  </div>
                </ThemeProvider>
              </>
            ) : null}
            {array ? <Table rows={array} collection="nutrition" typeOnClick="delete" /> : null}
          </>
        }
        actions={
          <>
            <Button label="Close" color="secondary" onClick={closeNutrition} />
          </>
        }
      />
    </>
  );
};

export default NutritionButton;
