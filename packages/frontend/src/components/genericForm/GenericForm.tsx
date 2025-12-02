
import React, { useState } from "react";
import { ZodError, ZodSchema } from "zod";
import { JSX } from "react";
import { Button, Box, FormControl, InputLabel, MenuItem, Select, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import InputField from "../generics/genericForm/InputField";

type FieldType = "text" | "select" | "radio" | "custom";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  showIf?: (formData: any) => boolean;
  render?: (formData: any, handleChange: (e: any) => void) => JSX.Element;
  disabled?: boolean | ((formData: any) => boolean);
}

interface GenericFormProps<T> {
  fields: FormField[];
  schema?: ZodSchema<any>;
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  onClose: () => void;
  title?: string;
}

export function GenericForm<T>({ title, fields, schema, initialData, onSubmit, onClose }: GenericFormProps<T>) {
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      const keys = name.split(".");
      const updated = { ...prev };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const validateForm = () => {
    try {
      if (schema) {
        schema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            fieldErrors[e.path[0]] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
    const message = err.message || "שגיאה בשליחה";
    setErrors((prev) => ({
      ...prev,
      email: message, 
    }));
  }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        width: "50%",
        mx: "auto",
        p: 4,
        backgroundColor: "#f0f4f8",
        borderRadius: 3,
        boxShadow: 4,
        border: "1px solid #ddd",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {title && (
        <Typography
          variant="h6"
          component="h2"
          sx={{
            textAlign: "center",
            mb: 2,
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography>
      )}
      {fields.map((field) => {
        const shouldShow = field.showIf ? field.showIf(formData) : true;
        if (!shouldShow) return null;

        const isDisabled = typeof field.disabled === "function" ? field.disabled(formData) : field.disabled;

        if (field.type === "custom" && field.render) {
          return <Box key={field.name}>{field.render(formData, handleChange)}</Box>;
        }

        if (field.type === "text") {
          return (
            <InputField
              key={field.name}
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              error={errors[field.name]}
              disable={isDisabled}
            />
          );
        }

        if (field.type === "select") {
          return (
            <FormControl fullWidth margin="normal" key={field.name}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                disabled={isDisabled}
                label={field.label}
                sx={{
                  backgroundColor: "#fff",
                  direction: "rtl",
                  textAlign: "right",
                }}
              >
                {field.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {errors[field.name] && (
                <Box color="error.main" fontSize="0.8rem" mt={0.5}>
                  {errors[field.name]}
                </Box>
              )}
            </FormControl>
          );
        }

        if (field.type === "radio") {
          return (
            <FormControl component="fieldset" margin="normal" key={field.name}>
              <FormLabel component="legend">{field.label}</FormLabel>
              <RadioGroup row name={field.name} value={formData[field.name] || ""} onChange={handleChange}>
                {field.options?.map((opt) => (
                  <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
                ))}
              </RadioGroup>
              {errors[field.name] && (
                <Box color="error.main" fontSize="0.8rem" mt={0.5}>
                  {errors[field.name]}
                </Box>
              )}
            </FormControl>
          );
        }

        return null;
      })}

      <Box
        mt={3}
        display="flex"
        justifyContent="flex-end" 
        gap={2} 
      >
        <Button type="submit" variant="contained" color="primary">
          שמור
        </Button>
        <Button variant="outlined" onClick={onClose}>
          סגור
        </Button>
      </Box>
    </Box>
  );
}
