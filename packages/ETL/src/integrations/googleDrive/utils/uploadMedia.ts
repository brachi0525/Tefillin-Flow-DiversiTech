import {driveService} from '../drive.service';
import { Readable } from 'stream';

export async function uploadBufferToDriveAndMakePublic(
  buffer: Buffer,
  fileName: string,
  folderId: string,
  mimeType: string 
): Promise<{ fileId: string;}> {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType,
      body: Buffer.isBuffer(buffer) ? Readable.from(buffer) : buffer,
    };
    const file = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });
    const uploadedFileId = file.data.id!;
    await driveService.permissions.create({
      fileId: uploadedFileId,
      requestBody: { role: 'reader', type: 'anyone' },
      fields: 'id',
    });

    return {

      fileId: uploadedFileId,
    };
  } catch (error: any) {
    throw error;
  }
}