import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
const envPath = path.resolve(__dirname, '../../../.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const credentials = JSON.parse(envConfig.GOOGLE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/cloud-platform',
  ],
});
export const driveService = google.drive({ version: 'v3', auth });