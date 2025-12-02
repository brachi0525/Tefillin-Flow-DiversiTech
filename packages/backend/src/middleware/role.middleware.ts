import { Response, NextFunction } from 'express';
import { DecodedRequest } from './auth.middleware';

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: DecodedRequest, res: Response, next: NextFunction) => {
    const userRole = req.decodedUser?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    next();
  };
};
