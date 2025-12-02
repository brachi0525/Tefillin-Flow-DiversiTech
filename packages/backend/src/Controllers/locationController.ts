import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../services/LocationService';
import { CreateLocationDto, UpdateLocationDto } from '../dto/location .dto';
import { updateLocationSchema, createLocationSchema } from '../schemas/vallidationsSchema';

const locationService = new LocationService();

export const getAllLocations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Controller: getAllLocations called');
    const locations = await locationService.getAllLocations();
    console.log('Repository: result from supabase', locations);
    res.json(locations);
  } catch (err) {
    next(err);
  }
}

export const getLocationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { id } = req.body;
    const location = await locationService.getLocationById(id);
    if (!location) {
      throw new Error('Location not found');
    }
    res.status(201).json(location);
  } catch (err) {
    console.error('Error in getLocationById:', err);
    next(err);
  }
};

export const createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = createLocationSchema.safeParse(req.body);
    if (!parseResult.success) throw parseResult.error;
    const dto: CreateLocationDto = parseResult.data;

    const newlocation = await locationService.createLocation(dto);
    res.status(201).json(newlocation);
  } catch (err) {

    next(err);
  }
};

export const updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.body;
    const parseResult = updateLocationSchema.safeParse(req.body);
    if (!parseResult.success) throw parseResult.error;
    const dto: UpdateLocationDto = parseResult.data;
    const location = await locationService.updateLocation(id, dto);
    if (!location) {
      throw new Error('Location not found');

    }
    res.json(location);
  } catch (err) {
    next(err);
  }
};

export const updateRabbiForLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'User email is required' });
    }
    const updatedLocation = await locationService.updateRabbiForLocation(id, email);
    const parseResult = updateLocationSchema.safeParse(updatedLocation);
    if (!parseResult.success) throw parseResult.error;
    res.json(updatedLocation);
  } catch (err) {
    next(err);
  }
};

export const deleteLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await locationService.deleteLocation(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export const getLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const location = await locationService.getLocationById(id);
    if (!location) {
      throw new Error('Location not found');
    }
    res.status(201).json(location);
  } catch (err) {
    console.error('Error in getLocationById:', err);
    next(err);
  }
}