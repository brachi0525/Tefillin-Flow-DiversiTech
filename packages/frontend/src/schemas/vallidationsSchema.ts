import * as Zod from 'zod';

export const emailSchema = Zod.object({
  email: Zod.string().email("Invalid email address"),
});

export const passwordSchema = Zod.object({
  password: Zod.string().min(6, "Password must be at least 6 characters"),
});

export const phoneSchema = Zod.object({
  phone: Zod.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

export const addressSchema = Zod.object({
  country: Zod.string().min(1, "Country is required"),
  city: Zod.string().min(1, "City is required"),
  street: Zod.string().min(1, "Street is required"),
  houseNumber: Zod.string().min(1, "House number is required"),
});

export const createLocationSchema = Zod.object({
  name: Zod.string().min(1, "Name is required"),
  phone: Zod.string().min(1, "Phone is required"),
  rabbiId: Zod.string().uuid().optional(),
  address: addressSchema, 
});

export const updateLocationSchema = Zod.object({
  id: Zod.string().uuid("ID must be a valid UUID"), 
  name: Zod.string().min(1).optional(),
  phone: Zod.string().min(1).optional(),
  rabbiId: Zod.string().uuid().optional(),
  address: addressSchema.partial().optional(),
});

export const getLocationByIdSchema = Zod.object({
  id: Zod.string().uuid("ID must be a valid UUID")
});

export const deleteLocationSchema = Zod.object({
  id: Zod.string().uuid("ID must be a valid UUID")
});
