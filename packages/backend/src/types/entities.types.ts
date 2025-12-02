export interface Address {
  id: number;
  country?: string;
  city?: string;
  street?: string;
  house_number?: string;
}

export interface Location {
  id: string;
  name: string;
  phone: string;
  created_at: Date;
  rabbi_id?: string;
  updatedat?: Date;
  calendarid?: string;
  isactive?: boolean;
  address_id?: number;
}

export interface Soldier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  mothers_name?: string;
  dominant_hand: string;
  form_filler_name?: string;
  form_filler_phone?: string;
  form_filler_relationship?: string;
  location_id?: string;
  tefillin_id?: string;
  last_contact_date?: Date;
  next_contact_date?: Date;
  created_at: Date;
  updated_at: Date;
  current_status?: 'active' | 'inactive' | 'pending' | 'completed';
}

export interface Tefillin {
  id: string;
  barcode: string;
  status: 'available' | 'distributed' | 'with_scribe' | 'maintenance' | 'damaged';
  checkername?: string;
  createdat?: Date;
  donorid?: string;
  donorname?: string;
  inmemoryof?: string;
  locationId?: string;
  parchmentimageurls?: any;
  productiondate?: Date;
  scribename?: string;
  updatedat?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'rabbi' | 'soldier' | 'donor';
  status?: 'active' | 'inactive';
  profile_image_url?: string;
  created_at?: Date;
  google_id?: string;
  last_login?: Date;
  token?: string;
  google_refresh_token?: string;
  location_id?: string;
  updated_at?: Date;
}

export interface DistributionPhoto {
  id: string;
  tefillin_id: string;
  soldier_id: string;
  location_id?: string;
  date?: Date;
  drive_url: string;
  description?: string;
  type: 'photo' | 'video';
  is_publishable: boolean;
}

export interface Donation {
  id: string;
  donor_name: string;
  phone?: string;
  email: string;
  dedication?: string;
  payment_status?: string;
  payment_id?: string;
  created_at?: Date;
}

export interface SoldierStatusHistory {
  id: string;
  soldier_id?: string;
  previous_status?: string;
  new_status: string;
  notes?: string;
  changed_at?: Date;
}