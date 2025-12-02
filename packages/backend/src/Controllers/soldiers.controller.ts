import { NextFunction, Request, Response } from 'express';
import { SoldierDto, } from '../dto/soldier.dto';
import { SoldierStatus } from '../../../../types/soldiers'
import { SoldierService } from '../services/soldiers.service';
import { changeStatusSchema, addSoldierCommentSchema, createSoldierSchema, updateSoldierSchema } from '../schemas/soldier.schema';
import { StatisticsDto } from '../dto/soldier.dto';
import { mapSupabaseToSoldier ,mapSoldierToDto, mapDtoToSoldier } from '../mappers/soldier.mapper';

// import { mapSupabaseToSoldier ,mapSoldierToDto} from '../mappers/soldier.mapper';

export const getAllSoldiers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const soldiers = await SoldierService.getAllSoldiers();
    //const soldierEntities = soldiers.map(mapSupabaseToSoldier);
    res.json(soldiers);
  } catch (err) {
    next(err);
  }
};

export const createSoldier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parseResult = createSoldierSchema.safeParse(req.body);
  if (!parseResult.success) throw parseResult.error;
  const dto: SoldierDto = req.body;
  try {

    const rawSoldier = await SoldierService.createSoldier(dto); // 👈 ישר שולחת DTO

    const savedSoldier = mapSupabaseToSoldier(rawSoldier);
    const responseDto = mapSoldierToDto(savedSoldier);


    res.status(201).json(responseDto);
  } catch (err) {
    console.error('Error in createSoldier:', err);
    next(err);
  }
};



export const updateSoldier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parseResult = updateSoldierSchema.safeParse(req.body);
  if (!parseResult.success) throw parseResult.error;
  const updates: Partial<SoldierDto> = req.body;
  try {
    const updated = await SoldierService.updateSoldier(req.params.id, updates);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteSoldier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await SoldierService.deleteSoldier(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);

  }
};

export const changeSoldierStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parseResult = changeStatusSchema.safeParse(req.body);
  if (!parseResult.success) throw parseResult.error;

  const { new_status, notes } = parseResult.data;

  try {
    const updated = await SoldierService.changeSoldierStatus(
      req.params.id,
      new_status as SoldierStatus,
      notes
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
export const addSoldierComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { content, category, visibleToAll, soldierId } = req.body;

  const userId = (req as any).user?.id;



  const comment = {
    soldierId,
    // userId,
    content,
    category,
    visibleToAll,
  };
  const parseResult = addSoldierCommentSchema.safeParse(comment);
  if (!parseResult.success) throw parseResult.error;
  try {
    const comment = await SoldierService.addSoldierComment({
      soldierId,
      // userId,
      content,
      category,
      visibleToAll,
    });

    res.status(201).json({ message: 'Comment was successfully added.' });
  } catch (err) {
    next(err);
  }
};

export const assignSoldierToLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { locationId, soldierId } = req.params;
  if (!locationId || !soldierId) {
    throw new Error('Invalid input: locationId and soldierId are required');
  }

  try {
    const result = await SoldierService.assignSoldierToLocation(locationId, soldierId);
    res.status(200).json({ message: 'Soldier assigned successfully', result });
  } catch (err) {
    next(err);
  }
};


export const assignTefillinToSoldier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { tefillinId } = req.body;
    const updatedSoldier = await SoldierService.assignTefillinToSoldier(id, tefillinId);
    res.json(updatedSoldier);
  } catch (err) {
    next(err);

  }
};
export const getSoldierReport = async (req: Request, res: Response): Promise<void> => {
    const status = req.params.status;
    const soldierStatus = status as SoldierStatus; 
    try {
        const soldiers = await SoldierService.getSoliderByStatus(soldierStatus); 
        res.status(200).json(soldiers);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
};


export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statistics: StatisticsDto = await SoldierService.calculateStatistics();
    res.status(200).json(statistics);
  } catch (error) {
    next(error);
  }
};


export const getPendingSoldiers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const soldiers = await SoldierService.getPendingSoldiers();

    res.json(soldiers);
  } catch (err) {
    next(err);
  }
};

export const getSoldierByTefillinId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tefillinId = req.params.id;
    if (!tefillinId) {
      res.status(400).json({ error: 'Tefillin ID is required' });
      return;
    }
    const soldier = await SoldierService.getSoldierByTefillinId(tefillinId);
    if (!soldier) {
      res.status(200).json(null);
      return;
    }
    res.status(200).json(soldier);
  } catch (err) {
    console.error('Error in getSoldierByTefillinId:', err);
    next(err);
  }
};