import { Request, Response, NextFunction } from 'express';
import * as Zod from 'zod';
import { emailSchema, passwordSchema, phoneSchema,createLocationSchema,updateLocationSchema,addressSchema} from '../schemas/vallidationsSchema';
export type ValidatedEmail = Zod.infer<typeof emailSchema>;
export type ValidatedPassword = Zod.infer<typeof passwordSchema>;
export type ValidatedPhone = Zod.infer<typeof phoneSchema>;
export type ValidatedCreateLocation = Zod.infer<typeof createLocationSchema>;
export type ValidatedUpdateLocation = Zod.infer<typeof updateLocationSchema>;

const handleValidation = <T extends Zod.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }

    (req as Request & { validatedData: Zod.infer<T> }).validatedData = result.data;
    next();
  };
};

export const validateEmail = handleValidation(emailSchema);
export const validatePassword = handleValidation(passwordSchema);
export const validatePhone = handleValidation(phoneSchema);
export const validateCreateLocation = handleValidation(createLocationSchema);
export const validateUpdateLocation = handleValidation(updateLocationSchema);
export const validatAaddress = handleValidation(addressSchema);