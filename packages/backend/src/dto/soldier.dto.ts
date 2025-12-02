import { CommentCategory, SoldierStatus } from "../../../../types";
export type dominant_hand = 'right' | 'left';
export interface SoldierDto {
  name: string;
  phone: string;
  email: string;
  address: string;
  mothersName?: string;
  dominantHand: 'right' | 'left';
  formFillerName?: string;
  formFillerPhone?: string;
  formFillerRelationship?: string;
  currentStatus: SoldierStatus;
  locationId?: string;
  tefillinId?: string;
  lastContactDate?: Date;
  nextContactDate?: Date;
  comments?: string;
}


export interface SoldierResponseDto extends SoldierDto {
  id?: string;
  created_at: Date;
  updated_at: Date;
  comments?: string;

}
export interface StatisticsDto {
  registeredCount: number;
  receivedCount: number;
  totalDaysWorn: number;
  averageDaysToReceive: number;
  monthlyDistributedCount: number;
  weeklyDistributedCount: number;
}
export interface SoldierCommentsDto {
  user_id: string | null;
  soldier_id: string;
  content: string;
  category?: CommentCategory;
  visible_to_all?: boolean;

}
export interface SoldierStatusHistoryDto {
  previousStatus?: string;
  newStatus: string;
  notes?: string;
  changedAt?: Date;
}

