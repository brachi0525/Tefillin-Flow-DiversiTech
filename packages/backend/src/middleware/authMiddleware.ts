import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User, UserRole } from '../../../../types/users';
import { JwtPayload } from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
const JWT_SECRET = config.jwtSecret;
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication required: No token provided or malformed' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded !== null && 'role' in decoded) {
            req.user = decoded as User;
            next();
        } else {
            console.error('Decoded token payload is not a valid User object:', decoded);
            res.status(403).json({ error: 'Invalid token payload: User data missing' });
        }
    } catch (err: any) {
        console.error('JWT verification error:', err.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};
export const roleCheck = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).send('Forbidden: Insufficient permissions');
            return;
        }
        next();
    };
};


