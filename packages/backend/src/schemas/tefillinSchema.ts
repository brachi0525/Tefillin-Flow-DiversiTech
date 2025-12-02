import { TefillinStatus } from '../../../../types/tefillin';
import * as Zod from 'zod';
export const tefillinSchema = Zod.object({
  barcode: Zod.string(),
  scribeName: Zod.string().optional(),
  checkerName: Zod.string().optional(),
  productiondate: Zod.string().optional(),
  status: Zod.nativeEnum(TefillinStatus),
 locationId: Zod.preprocess(
  (val) => val === '' || val === null ? undefined : val,
  Zod.string().uuid().optional()
),
  parchmentimageurls: Zod.any().optional(),
  donorId: Zod.string().optional(),
  donorName: Zod.string().optional(),
  inmemoryof: Zod.string().optional(),
});
