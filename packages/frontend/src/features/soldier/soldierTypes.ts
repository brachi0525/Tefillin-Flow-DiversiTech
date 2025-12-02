import { SoldierMedia } from "../../../../../types/media";
import { Payment } from "../../../../../types/payments";
import { SoldierComment } from "../../../../../types/comments";


export enum SoldierStatus {
  REGISTERED = "registered",
  APPROVED = "approved",
  REJECTED = "rejected", 
  PAID = "paid",
  SCHEDULED = "scheduled",
  RECEIVED = "received"
}

export interface StatusChange {
  id: string;
  status: SoldierStatus;
  date: Date;
  user_id: string;
  user_name: string;
  notes?: string;
  created_at: Date;
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
  currentStatus: SoldierStatus;
  
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