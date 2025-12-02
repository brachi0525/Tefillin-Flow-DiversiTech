import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: path.resolve(__dirname, '.env.test'),
});
console.log('✅ Loaded env file for test:', process.env.SUPABASE_URL);
