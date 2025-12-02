export enum FeedItemType {
    STORY = "story",
    MEDIA = "media",
    MILESTONE = "milestone"
  }
  
  export interface PublicFeedItem {
    id: string;
    type: FeedItemType;
    title: string;
    content: string;
    mediaUrls?: string[];
    soldierName?: string;
    locationName?: string;
    publishedDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }