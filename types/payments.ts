export enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    BANK_TRANSFER = "bank_transfer",
    CASH = "cash",
    DONATION = "donation",
    OTHER = "other"
  }
  
  export enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
  }
  
  export interface Payment {
    id: string;
    amount: number;
    date: Date;
    method: PaymentMethod;
    status: PaymentStatus;
    receiptUrl?: string;
    notes?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }