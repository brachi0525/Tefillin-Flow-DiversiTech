import { driveService } from "../drive.service";

import { getGoogleDriveDirectUrl } from "./driveUrls";
import { ensureSubfolderExists } from "./ensureFolderExists";

export async function loadingFileFromTheDrive(fileId: string): Promise<string[]> {
    try {
        const res = await driveService.files.get({
            fileId,
            fields: 'webViewLink',
        });
        return [res.data.webViewLink || ''];
    } catch (error) {
        console.error('Error fetching file:', error);
        return [];
    }
}


export async function loadingFilesFromTheDrive(parentFolderId: string, subFolderId: string): Promise<string[]> {
    try {
        const subfolderExists = await ensureSubfolderExists(parentFolderId, subFolderId);
        
        const res = await driveService.files.list({
            q: `'${subfolderExists}' in parents`,
            fields: 'files(id)',
        });
        const files = res.data.files;
        if (files && files.length) {
            return files.map(file => getGoogleDriveDirectUrl(file.id || '') || '');

        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching file IDs:', error);
        throw error;
    }
}