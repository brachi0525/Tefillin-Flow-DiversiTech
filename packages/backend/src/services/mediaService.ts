import { uploadBufferToDriveAndMakePublic } from '../../../ETL/src/integrations/googleDrive/utils/uploadMedia';
import { BaseRepository } from '../repositories/baseRepository';
import { MediaType, SoldierMedia } from '../../../../types/media';
import { CreateMediaDto, GalleryFilters} from '../dto/media.dto';

import { validateAndGetMediaType } from '../utils/fileValidation';
import { getGoogleDriveVideoEmbedUrl, getGoogleDriveDirectUrl } from '../../../ETL/src/integrations/googleDrive/utils/driveUrls';
import { loadingFileFromTheDrive } from '../../../ETL/src/integrations/googleDrive/utils/laodingMedia'
import {ensureSubfolderExists} from '../../../ETL/src/integrations/googleDrive/utils/ensureFolderExists'
import { tefillinService } from './tefillinService';
import { Soldier } from '../../../../types/soldiers';
import { Location } from '../../../../types/locations';
import { any, undefined } from 'zod';
import { UUID } from 'crypto';

const ensuredFolders = new Set<string>();

export class MediaService {
    private mediaRepository = new BaseRepository<CreateMediaDto>('distributions_photos');
    private repository = new BaseRepository('tefillin_photos');
    private locationRepository = new BaseRepository<Location>('locations');
    private soldierRepository = new BaseRepository<Soldier>('soldiers');

    public async uploadMedia(file: Express.Multer.File, mediaData: CreateMediaDto, folderId: string): Promise<void> {
        const { originalname, buffer, mimetype } = file;
        const validatedMimeType = await validateAndGetMediaType(buffer, originalname);
        const fileId = await uploadBufferToDriveAndMakePublic(buffer, originalname, folderId, mimetype);

        if (!fileId) {
            throw new Error('Failed to upload file to Google Drive');
        }
        const type: MediaType = mimetype.startsWith('image/') ? MediaType.PHOTO : MediaType.VIDEO;
        const newItem: CreateMediaDto = {
            type: type,
            description: mediaData.description ?? '',
            drive_url: fileId.fileId,
            is_publishable: mediaData.is_publishable ?? false,
            location_id: mediaData.location_id,
            tefillin_id: mediaData.tefillin_id,
            soldier_id: mediaData.soldier_id,
        };
        const createMedia = await this.mediaRepository.insert(newItem);
        if (!createMedia) {
            throw new Error('Failed to create media record in the database');
        }

        return;
    }

    public async getGalleryItems(
        filters: GalleryFilters,
        limit? :number,
        offset? :number
    ): Promise<any[]> {
        const paginatedItems = await this.mediaRepository.filter(filters, limit, offset);
        const galleryItems = await Promise.all(

            paginatedItems.map(async (item : any) => {
               const driveLinks =
                    item.type === 'photo'
                        ? await getGoogleDriveDirectUrl(item.driveUrl)
                        : await getGoogleDriveVideoEmbedUrl(item.driveUrl);
                return {

                    type: item.type === 'photo' ? 'image' : 'video',
                    url: driveLinks,
                    title: item.description,
                };
            })
        );

        return galleryItems;
    }
    
    public async uploadTefillinPhoto(file: Express.Multer.File, id: string, message?: string): Promise<void> {
        const { originalname, buffer, mimetype } = file;
        const folderId = "1nzoj_jvJYGdps5HzKulKmfi54pw06l6j";
       
        const validatedMimeType = await validateAndGetMediaType(buffer, originalname);

        const folder = await ensureSubfolderExists(folderId, id);
        const fileId = await uploadBufferToDriveAndMakePublic(
            buffer,
            originalname,
            folder,
            mimetype,
        );

        await this.repository.insert({
            tefillin_id: id,
            file_id: fileId.fileId,
            message: message ?? null,

        });
    }

}


