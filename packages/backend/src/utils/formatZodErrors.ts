import { ZodError, ZodIssue } from 'zod';

export const formatZodErrors = (error: ZodError): string => {
  return error.errors
    .map((issue: ZodIssue) => {
      const path = issue.path.join('.');
      return `Field '${path}' ${issue.message}`;
    })
    .join('; ');
};
