

import React from "react";
import { TextField } from "@mui/material";

type TextInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  disable?: boolean;
};

const InputField: React.FC<TextInputProps> = ({ label, name, value, onChange, placeholder, error, type = "text", disable = false }) => (
  <TextField
    fullWidth
    margin="dense"
    variant="outlined"
    label={label}
    name={name}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    disabled={disable}
    type={type}
    error={!!error}
    helperText={error}
    dir="rtl"
    InputProps={{
      sx: {
        backgroundColor: "#fff",
        direction: "rtl",
      },
    }}
  />
);

export default InputField;
