import React from "react";
import TextField from "@mui/material/TextField";
import MuiAutocomplete from "@mui/material/Autocomplete";
import { useRouter } from "next/router";

type IAutocomplete = {
  label: string;
  completions: any[];
};

const Autocomplete = ({ label, completions }: IAutocomplete) => {
  const router = useRouter();

  return (
    <>
      <MuiAutocomplete
        freeSolo
        id={label}
        disableClearable
        options={completions?.map((option: any) => option.displayName)}
        onChange={(_event: any, value: any) => {
          router.push("/");
          router.push(`/profile/${value}`);
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
    </>
  );
};

export default Autocomplete;
