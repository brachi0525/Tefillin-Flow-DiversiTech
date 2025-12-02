

import { supabase } from '../supabase/supabaseClient';
import { Soldier } from '../../../../types/soldiers';

function toSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
}

function toCamelCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

export class BaseRepository<T> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async filterWithSearch(
    filters: Partial<T>,
    searchFields: Partial<Record<keyof T, string>>
  ): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');

    const snakeFilters = toSnakeCase(filters);
    for (const [key, value] of Object.entries(snakeFilters)) {
      if (value !== undefined) query = query.eq(key, value);
    }

    const snakeSearch = toSnakeCase(searchFields);
    for (const [key, searchValue] of Object.entries(snakeSearch)) {
      if (searchValue) query = query.ilike(key, `%${searchValue}%`);
    }
    const { data, error } = await query;
    if (error) throw new Error(`FilterWithSearch failed: ${error.message}`);
    return (data ?? []).map(toCamelCase) as T[];
  }

  async filter(filters: Partial<T>, limit?: number, offset?: number): Promise<T[]> {
    const snakeFilters = toSnakeCase(filters);

    let query = supabase.from(this.tableName).select('*');
    for (const [key, value] of Object.entries(snakeFilters)) {
      if (value !== undefined) query = query.eq(key, value);
    }
    if (limit !== undefined && offset !== undefined) {
      query = query.range(offset, offset + limit - 1);
    }
    const { data, error } = await query;
    if (error) throw new Error(`Filter failed: ${error.message}`);
    return (data ?? []).map(toCamelCase) as T[];
  }


  async getAll(): Promise<T[]> {
    const { data, error } = await supabase.from(this.tableName).select('*');
    if (error) throw error;
    return (data ?? []).map(toCamelCase) as T[];
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? toCamelCase(data) as T : null;
  }

  async insert(item: Partial<T>): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(toSnakeCase(item))
      .select()
      .single();

    if (error) throw error;
    return data ? toCamelCase(data) as T : null;
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(toSnakeCase(item))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data ? toCamelCase(data) as T : null;
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(`Item with id ${id} not found for deletion`);
    }
  }

  async findOne(condition: Partial<T>): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .match(toSnakeCase(condition))
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? toCamelCase(data) as T : null;
  }

  async getByStatuses(statuses: string[]): Promise<Soldier[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .in('current_status', statuses);

    if (error) throw error;
    return (data ?? []).map(toCamelCase) as Soldier[];
  }
}