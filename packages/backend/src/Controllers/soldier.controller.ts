import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase/supabaseClient';

export const getAllSoldiers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await supabase.from('soldiers').select('*');
    if (error) throw error;

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const createSoldier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, current_status } = req.body;
    if (!name || !phone || !current_status) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const { data, error } = await supabase
      .from('soldiers')
      .insert({ name, phone, current_status })
      .select();

    if (error) throw error;

    res.status(201).json(data?.[0]);
  } catch (err) {
    next(err);
  }
};

export const updateSoldier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const { name, phone, current_status } = req.body;

    const { data, error } = await supabase
      .from('soldiers')
      .update({ name, phone, current_status })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data.length) {
      res.status(404).json({ error: 'Soldier not found' });
      return;
    }

    res.json(data[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteSoldier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;

    const { error } = await supabase.from('soldiers').delete().eq('id', id);
    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getPendingSoldiers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pendingStatuses = ['registered'];

    const { data, error } = await supabase
      .from('soldiers')
      .select('*')
      .in('current_status', pendingStatuses);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    next(err);
  }
};

