import { ReportFilters } from '../../types/reports.types';

export class GetReportsRequestDto implements ReportFilters {
  startDate?: string;
  endDate?: string;
  soldierIds?: string[];
  locationIds?: string[];
  status?: 'active' | 'inactive' | 'all';
  
  reportType!: 'usage' | 'location' | 'system';  
  format?: 'json' | 'csv' | 'pdf';
  limit?: number;
  offset?: number;
}

export class GenerateReportRequestDto {
  reportType!: 'usage' | 'location' | 'system'; 
  filters!: ReportFilters;                       
  format?: 'json' | 'csv' | 'pdf';
  email?: string;
}
