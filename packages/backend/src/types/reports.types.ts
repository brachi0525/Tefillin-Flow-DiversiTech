export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  soldierIds?: string[];
  locationIds?: string[];
  tefillinIds?: string[];
  status?: string;
  reportType?: string;
  donorName?: string;
  rabbiId?: string;
}

export interface SoldierReport {
  soldierId: string;
  soldierName: string;
  email: string;
  phone: string;
  locationName: string;
  currentStatus: string;
  tefillinBarcode?: string;
  tefillinStatus?: string;
  lastContactDate?: Date;
  nextContactDate?: Date;
  createdAt: Date;
}

export interface TefillinReport {
  tefillinId: string;
  barcode: string;
  status: string;
  locationName?: string;
  soldierName?: string;
  donorName?: string;
  inMemoryOf?: string;
  scribeName?: string;
  productionDate?: Date;
  createdAt?: Date;
}

export interface LocationReport {
  locationId: string;
  locationName: string;
  rabbiName?: string;
  phone: string;
  address?: string;
  totalSoldiers: number;
  activeSoldiers: number;
  totalTefillin: number;
  distributedTefillin: number;
  availableTefillin: number;
  isActive: boolean;
}

export interface DonationReport {
  donationId: string;
  donorName: string;
  email: string;
  phone?: string;
  totalAmount: number;
  paymentStatus: string;
  dedication?: string;
  createdAt: Date;
  items: DonationItemReport[];
}

export interface DonationItemReport {
  donationType: string;
  productName?: string;
  quantity?: number;
  amount?: number;
  totalAmount: number;
}

export interface SystemReport {
  totalSoldiers: number;
  activeSoldiers: number;
  totalTefillin: number;
  availableTefillin: number;
  distributedTefillin: number;
  totalLocations: number;
  activeLocations: number;
  totalDonations: number;
  totalDonationAmount: number;
  recentDistributions: number;
  topLocations: LocationReport[];
  recentSoldiers: SoldierReport[];
}

export interface DistributionReport {
  distributionId: string;
  soldierName: string;
  tefillinBarcode: string;
  locationName: string;
  distributionDate: Date;
  photoUrl: string;
  description?: string;
  isPublishable: boolean;
}
