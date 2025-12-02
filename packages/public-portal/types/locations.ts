export interface LocationInventoryItem {
    tefillinCount: number;
    tallitCount: number;
    kippahCount: number;
    tanyaCount: number;
    otherItems?: Record<string, number>;
  }
  
  export interface Location {
    id: string;
    name: string;
    rabbiName: string;
    phone: string;
    address: string;
    city: string;
    isActive: boolean;
    
    // Calendar integration
    calendarId?: string;
    
    // Inventory
    inventory: LocationInventoryItem;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
  }