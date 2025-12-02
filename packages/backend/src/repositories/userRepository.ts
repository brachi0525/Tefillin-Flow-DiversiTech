import { BaseRepository } from '../repositories/baseRepository';
import { User } from '../../../../types/users';
import { supabase } from '../supabase/supabaseClient';
import { fromSupabaseToUser, fromUserToSupabase } from '../mappers/user.mapper';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  async getFilteredAndPaginated(
    filters: Partial<User>,
    sort: { [key: string]: 1 | -1 },
    page: number,
    limit: number
  ): Promise<{ data: User[]; total: number }> {
    const offset = (page - 1) * limit;
    let query = supabase.from('users').select('*', { count: 'exact' }).range(offset, offset + limit - 1);

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') {
        query = query.eq(key, value);
      }
    }

    for (const [field, order] of Object.entries(sort)) {
      query = query.order(field, { ascending: order === 1 });
    }

    const { data, count, error } = await query;
    if (error) throw new Error(`Repository error: ${error.message}`);

    return { data: (data ?? []).map(fromSupabaseToUser), total: count || 0 };
  }

  async insert(user: User): Promise<User | null> {
    const now = new Date();
    const userToInsert = {
      ...user,
      createdAt: user.createdAt ?? now,
      updatedAt: user.updatedAt ?? now,
    };
    const supabaseObj = fromUserToSupabase(userToInsert);
    const { data, error } = await supabase.from('users').insert(supabaseObj).select().single();
    if (error) throw error;
    return fromSupabaseToUser(data);
  }

  async update(id: string, userDto: Partial<User>): Promise<User | null> {
    const supabaseObj = fromUserToSupabase({
      ...userDto,
      updatedAt: new Date(),
    } as User);
    const { data, error } = await supabase.from('users').update(supabaseObj).eq('id', id).select().single();
    if (error) throw error;
    return fromSupabaseToUser(data);
  }

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) return null;
    return fromSupabaseToUser(data);
  }

  async getByGoogleId(googleId: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('google_id', googleId).single();
    if (error || !data) return null;
    return fromSupabaseToUser(data);
  }

  async updateGoogleTokens(id: string, refreshToken: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ google_refresh_token: refreshToken, updated_at: new Date() })
      .eq('id', id);

    if (error) throw new Error(`Failed to update Google tokens: ${error.message}`);
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase.from('users').delete().eq('id', id).select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(`Item with id ${id} not found for deletion`);
    }
  }

  async filter(filters: Partial<User>): Promise<User[]> {
    let query = supabase.from('users').select('*');
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) query = query.eq(key, value);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(fromSupabaseToUser);
  }
}
