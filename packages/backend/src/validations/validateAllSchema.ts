import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: result.error.format()
      });
      return; 
    }

    req.body = result.data;
    next();
  };
};
