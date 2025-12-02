import { z } from 'zod';
import { emailSchema, phoneSchema } from './vallidationsSchema';
import { CommentCategory } from '../../../../types';



export const dominantHandEnum = z.enum(['right', 'left']);
export const soldierStatusEnum = z.enum([
  'registered',
  'approved',
  'paid',
  'scheduled',
  'received',
  'rejected'
]);

export const createSoldierSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  phone: phoneSchema.shape.phone,
  email: emailSchema.shape.email,

  address: z.string().min(1, 'Address is required'),
  dominant_hand: dominantHandEnum,
  current_status: soldierStatusEnum,

  mothersName: z.string().optional(),
  formFillerName: z.string().optional(),
  formFillerPhone: phoneSchema.shape.phone.optional(),
  formFillerRelationship: z.string().optional(),

  locationId: z.string().uuid().optional(),
  tefillinId: z.string().uuid().optional(),

  lastContactDate: z
    .union([z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)), z.date()])
    .optional()
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),

  nextContactDate: z
    .union([z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)), z.date()])
    .optional()
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),
});
export const changeStatusSchema = z.object({
  new_status: z.enum(['registered', 'approved', 'paid', 'scheduled', 'received']),
  notes: z.string().optional(),
});

export const addSoldierCommentSchema = z.object({
  soldierId: z.string().uuid('Soldier ID must be a valid UUID.'),
  content: z.string().min(1, 'Comment content is required.'),
  category: z.nativeEnum(CommentCategory).optional(),
visibleToAll: z
  .union([z.boolean(), z.string()])
  .transform((val) => val === 'true' || val === true)
  .optional(),
  userId: z.string().uuid('User ID must be a valid UUID.').optional(),
});
export const updateSoldierSchema = createSoldierSchema.partial();
