import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('חובה להגדיר SUPABASE_URL ו-SUPABASE_SERVICE_ROLE_KEY בקובץ הסביבה!');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function runTransaction<T>(
  callback: (trxClient: typeof supabase) => Promise<T>
): Promise<T> {
  const { error: beginError } = await supabase.rpc('begin');
  if (beginError) {
    throw new Error('❌ Failed to begin transaction: ' + beginError.message);
  }

  try {
    const result = await callback(supabase); 
    const { error: commitError } = await supabase.rpc('commit');
    if (commitError) {
      throw new Error('❌ Failed to commit transaction: ' + commitError.message);
    }
    return result;
  } catch (err) {
    await supabase.rpc('rollback');
    throw new Error('❌ Transaction failed and rolled back: ' + (err as Error).message);
  }
}
