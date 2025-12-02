import { UUID } from "crypto";
import { MediaType } from "../../../../types/media";

export interface MediaDto {
    description: string;
    url: string;
    type: string; 
    createdAt: Date;
    updatedAt: Date;
    userId: string; 
    tags?: string[]; 
    isPublic?: boolean; 
}

export interface CreateMediaDto {
    description: string;
    type: MediaType; 
    tefillin_id: UUID;
    soldier_id: UUID;
    location_id: UUID;
    drive_url: string;
    is_publishable?: boolean; 
}
export type GalleryFilters = {
    type:MediaType;
  soldier_name?: string;
  location_name?: string;
} & Partial<CreateMediaDto>;