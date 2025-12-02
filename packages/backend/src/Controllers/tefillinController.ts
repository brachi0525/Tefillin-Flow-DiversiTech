
import { NextFunction, Request, Response } from 'express';
const express = require('express');
import { ParsedQs } from 'qs'; 
import {tefillinService} from '../services/tefillinService';
import { tefillinSchema } from '../schemas/tefillinSchema';
import { TefillinDto} from '../dto/teffilin.dto';
import { Tefillin } from '../../../../types/tefillin';
import { TefillinStatus } from '../../../../types/tefillin';
import { error } from 'console';

export const movingTefillinLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tefilinId, newLocationId } = req.body;

  if (!tefilinId || !newLocationId) {
    res.status(400).json({ message: "tefilinId and newLocationId are required" });
    return;
  }

  try {
    const newLocation: Partial<Tefillin> = { locationId: newLocationId };
    const result = await tefillinService.moveTefilinService(tefilinId, newLocation);
    res.status(200).json({ message: 'Tefillin location updated successfully', result });
  } catch (error) {
    next(error);
  }
};

export const addTefillin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parseResult = tefillinSchema.safeParse(req.body);
  if (!parseResult.success) throw parseResult.error;
  const dto: TefillinDto = parseResult.data;
  try {
    console.log('before service call');
    const tefillin = await tefillinService.addTefillin(dto);
    console.log('after service call');
    res.status(201).json({ tefillin });
  } catch (error) {
    next(error);
  }
};
export const getFilteredTefillin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { status, locationId } = req.query;
  if (status && !Object.values(TefillinStatus).includes(status as TefillinStatus)) {
   throw new Error( 'Invalid status value' );
    return;
  }
  try {
    const result = await tefillinService.filterTefillinByStatusAndLocation(
      status as TefillinStatus,
      locationId as string
    );
    res.json(result);
  } catch (error) {
next(error);  }
};

export const updateStatus = async (req: Request, res: Response,next: NextFunction): Promise<void> => {
  const { tefilinId,status } = req.body;
  if (!Object.values(TefillinStatus).includes(status)) {
    throw new Error( 'Invalid status' );
  }
  try {
    const result = await tefillinService.updateTefillinStatus(tefilinId, status as TefillinStatus);
    res.json({ message: 'Status updated', result });
  } catch (error) {
      next(error);
  }
};


export const completeDistribution = async (req: Request, res: Response,next: NextFunction): Promise<void> => {
  const { tefilinId} = req.body;
  try {
    const result = await tefillinService.markTefillinAsCompleted(tefilinId);
    res.json({ message: 'Tefillin marked as completed', result });
  } catch (error) {
      next(error);
     }
};

    export const getTefillinReport = async (req: Request, res: Response): Promise<void> => {
    const status = req.params.status;
    const tefillinStatus = status as TefillinStatus; 
    try {
        const tefillin = await tefillinService.getTefillinByStatus(tefillinStatus);
        res.status(200).json(tefillin);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
};

export const getTefillinById = async (req: Request, res: Response): Promise<void> => {
const tefilinId = req.params.tefillinId;
  if (!tefilinId) {
    res.status(400).json({ error: "Tefillin ID is required" });
    return;
  }
  try {
    const tefillin = await tefillinService.getTefillinById(tefilinId);
    if (!tefillin) {
      res.status(404).json({ error: "Tefillin not found" });
      return;
    }
    res.status(200).json(tefillin);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the tefillin" });
  }
}