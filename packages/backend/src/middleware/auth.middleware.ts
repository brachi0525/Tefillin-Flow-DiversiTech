// import { Request, Response, NextFunction } from 'express';
// import { supabase } from '../supabase/supabaseClient';

// export const authenticate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   console.log('🔐 Middleware authenticate run!');

//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     res.status(401).json({ error: 'Missing or invalid Authorization header' });
//     return;
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const { data, error } = await supabase
//       .from('users')       
//       .select('*')
//       .eq('token', token)
//       .single();

//     if (error || !data) {
//       res.status(403).json({ error: 'Invalid token' });
//       return;
//     }


//     next();
//   } catch (err) {
//     console.error('🔥 Error in authenticate middleware:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';

export interface JwtDecodedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface DecodedRequest extends Request {
  decodedUser?: JwtDecodedUser;
}

export const authenticateToken = (
  req: DecodedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = verifyAccessToken(token) as JwtDecodedUser;
    req.decodedUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
};
