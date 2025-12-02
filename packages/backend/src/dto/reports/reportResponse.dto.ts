import { 
  TefillinReport, 
  LocationReport, 
  SystemReport
} from '../../types/reports.types';

export class TefillinReportResponseDto implements TefillinReport {
  tefillinId!: string;
  barcode!: string;
  status!: string;
  locationName?: string;
  soldierName?: string;
  donorName?: string;
  inMemoryOf?: string;
  scribeName?: string;
  productionDate?: Date;  
  createdAt?: Date;      
}

export class LocationReportResponseDto implements LocationReport {
  locationId!: string;
  locationName!: string;
  rabbiName?: string;
  phone!: string;        
  address?: string;
  totalSoldiers!: number;
  activeSoldiers!: number;
  totalTefillin!: number;
  distributedTefillin!: number;
  availableTefillin!: number;
  isActive!: boolean;
}

export class SystemReportResponseDto implements SystemReport {
  totalSoldiers!: number;
  activeSoldiers!: number;
  totalTefillin!: number;
  availableTefillin!: number;
  distributedTefillin!: number;
  totalLocations!: number;
  activeLocations!: number;
  totalDonations!: number;
  totalDonationAmount!: number;
  recentDistributions!: number;
  topLocations!: LocationReport[];
  recentSoldiers!: any[];
}

export class ReportResponseDto<T> {
  success!: boolean;
  reportType!: string;
  data!: T;
  count!: number;
  filters!: any;
  generatedAt!: Date;
  message?: string;
}

