import { UUID } from "crypto";

export enum MediaType {
    PHOTO = "photo",
    VIDEO = "video"
  }
  
  export interface SoldierMedia {
    id: string;
    type: MediaType;
    url: string;
    caption?: string;
    isPublishable: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface mediaFilrers {
    all:string;
 description: string;
    type: MediaType; 
    tefillin_id: UUID;
    soldier_id: UUID;
    location_id: UUID; 
    createdAt: Date;
   
  }