import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select";
import { ThemeProvider } from "@emotion/react";
import { selectTheme } from "../utils/muiTheme";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { setExercisesState } from "../redux/exercises.slice";

export type ISelectOptions = {
  key: any;
  label: string;
};

type ISelect = {
  label: string;
  val?: string;
  options: ISelectOptions[];
  selectFor?: string;
};

const Select = ({ label, val, options, selectFor }: ISelect) => {
  const [value, setValue] = React.useState(val);

  const dispatch = useDispatch();
  const exercisesRedux = useSelector((state: any) => state.exercises.exercises);

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);

    switch (selectFor) {
      case "Exercises": {
        dispatch(
          setExercisesState({
            ...exercisesRedux,
            filter: event.target.value.toLowerCase(),
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
      <ThemeProvider theme={selectTheme}>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <MuiSelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value}
              label={label}
              onChange={handleChange}
            >
              {options.map(option => (
                <MenuItem key={option.key} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Select;
