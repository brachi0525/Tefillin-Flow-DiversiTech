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