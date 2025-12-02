export interface LocationInventoryItem {
    tefillinCount: number;
    tallitCount: number;
    kippahCount: number;
    tanyaCount: number;
    otherItems?: Record<string, number>;
  }

  export interface Address {
  id: number;
  country: string;
  city: string;
  street: string;
  houseNumber: string;
  }
  
  export interface Location {
    id: string;
    name: string;
    rabbiName: string;
    rabbiId?: string;
    phone: string;
    address: Address;
    city: string;
    isactive: boolean;
    countAll: number;
    countReady: number;
    
    // Calendar integration
    calendarId?: string;

    // Inventory
    inventory: LocationInventoryItem;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
  }

  export interface CreateLocationDto {
    name: string;
    phone: string;
    address: AddressCreateDto; 
  }
  export interface AddressCreateDto {
    country: string;
    city: string;
    street: string;
    houseNumber: string;
  }