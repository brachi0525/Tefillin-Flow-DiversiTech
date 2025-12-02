import { driveService } from "../drive.service";

export async function ensureSubfolderExists(
    parentFolderId: string,
    subfolderName: string
): Promise<string> {
    try {
        const response = await driveService.files.list({
            q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${subfolderName}' and trashed = false`,
            fields: 'files(id, name)',
        });

        if (response.data.files && response.data.files.length > 0) {
            const folderId = response.data.files[0].id;
            if (!folderId) {
                throw new Error("Folder exists but has no ID");
            }
            return folderId;
        }


        const fileMetadata = {
            name: subfolderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
        };

        const folder = await driveService.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        return folder.data.id!;
    } catch (error) {
        console.error('Error in ensureSubfolderExists:', error);
        throw error;
    }
}