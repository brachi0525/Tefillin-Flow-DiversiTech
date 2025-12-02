import { z } from 'zod';
import { UserRole , UserStatus} from '../features/user/userTypes';

export const userSchema = z.object({
  email: z.string().email("אימייל לא תקין"),
  name: z.string().min(2, "יש להכניס שם באורך 2 תוים לפחות"),
  phone: z.string().regex(/^0\d{8,9}$/, "טלפון לא תקין"),
  role: z.union([z.literal(""), z.nativeEnum(UserRole)])
  .refine((val) => val !== "", {
    message: "יש לבחור תפקיד",
  }),
  status: z.nativeEnum(UserStatus),
  profileImageUrl: z.string().url().optional(),
  created_at: z.string().optional(),
  lastLogin: z.string().optional(),
  
});
