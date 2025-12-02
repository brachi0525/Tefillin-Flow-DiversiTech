import { TefillinStatus } from '../../../../types/tefillin';
import * as Zod from 'zod';
export const tefillinSchema = Zod.object({
  barcode: Zod.string(),
  scribename: Zod.string().optional(),
  checkername: Zod.string().optional(),
  productiondate: Zod.string().optional(),
  status: Zod.nativeEnum(TefillinStatus),
 locationid: Zod.preprocess(
  (val) => val === '' || val === null ? undefined : val,
  Zod.string().uuid().optional()
),
  parchmentimageurls: Zod.any().optional(),
  donorid: Zod.string().optional(),
  donorname: Zod.string().optional(),
  inmemoryof: Zod.string().optional(),
});






