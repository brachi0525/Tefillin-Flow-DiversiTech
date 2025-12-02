export enum CommentCategory {
  GENERAL = "general",
  DISTRIBUTION = "distribution",
  FOLLOW_UP = "follow_up",
  PAYMENT = "payment",
  PRIVATE = "private"
}

export interface SoldierComment {
  id: string;
  userID?: string;
  soldierID: string;
  content: string;
  category?: CommentCategory;
  visibleToAll: boolean;
  createdAt: Date;
  updatedAt: Date;
}