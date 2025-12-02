import { Payment } from './payments';
import { SoldierMedia } from './media';
import { SoldierComment } from './comments';

export enum SoldierStatus {
  REGISTERED = "REGISTERED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
  SCHEDULED = "SCHEDULED",
  RECEIVED = "RECEIVED"
}

export interface StatusChange {
  id: string;
  status: SoldierStatus;
  date: Date;
  userId: string;
  userName: string;
  notes?: string;
  createdAt: Date;
}

export interface Soldier {
  id: string;
  
  // Basic Information
  name: string;
  phone: string;
  email?: string;
  address: string;
  mothersName?: string;
  dominantHand: "right" | "left";
  
  // Form Metadata
  formFillerName?: string;
  formFillerPhone?: string;
  formFillerRelationship?: string;
  
  // Current Status
  current_status: SoldierStatus;
  
  // Location and Assignment
  locationId?: string;
  tefillinId?: string;
  
  // Embedded collections
  statusHistory: StatusChange[];
  payments: Payment[];
  media: SoldierMedia[];
  comments: SoldierComment[];
  
  // Contact History
  lastContactDate?: Date;
  nextContactDate?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
export interface SoldierStatusHistory {
  id?:string;
  soldier_id: string;
  previous_status?: string;
  new_status: string;
  notes?: string;
  changed_at?: string;
}