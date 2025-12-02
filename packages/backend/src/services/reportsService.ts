import { BaseRepository } from '../repositories/baseRepository';
import { 
  Soldier, 
  Tefillin, 
  Location, 
  User, 
  DistributionPhoto, 
  Donation, 
  Address 
} from '../types/entities.types';
import { 
  ReportFilters, 
  SoldierReport, 
  TefillinReport, 
  LocationReport, 
  DonationReport,
  SystemReport,
  DistributionReport 
} from '../types/reports.types';

const soldiersRepo = new BaseRepository<Soldier>('soldiers');
const tefillinRepo = new BaseRepository<Tefillin>('tefillin');
const locationsRepo = new BaseRepository<Location>('locations');
const usersRepo = new BaseRepository<User>('users');
const distributionsRepo = new BaseRepository<DistributionPhoto>('distributions_photos');
const donationsRepo = new BaseRepository<Donation>('donations');
const addressesRepo = new BaseRepository<Address>('addresses');

export class ReportsService {
  
  async getSoldiersReport(filters: ReportFilters): Promise<SoldierReport[]> {
    let soldiers = await soldiersRepo.getAll();
    
    if (filters.startDate && filters.endDate) {
      soldiers = soldiers.filter(s =>
        new Date(s.created_at) >= new Date(filters.startDate!) &&
        new Date(s.created_at) <= new Date(filters.endDate!)
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      soldiers = soldiers.filter(s => s.current_status === filters.status);
    }
    
    if (filters.locationIds && filters.locationIds.length > 0) {
      soldiers = soldiers.filter(s => 
        s.location_id && filters.locationIds!.includes(s.location_id.toString())
      );
    }
    
    const locations = await locationsRepo.getAll();
    const tefillin = await tefillinRepo.getAll();
    
    const reports: SoldierReport[] = soldiers.map(soldier => {
      const location = locations.find(l => l.id === soldier.location_id);
      const soldierTefillin = tefillin.find(t => t.id === soldier.tefillin_id);
      
      return {
        soldierId: soldier.id,
        soldierName: soldier.name,
        email: soldier.email,
        phone: soldier.phone,
        locationName: location?.name || 'לא משויך',
        currentStatus: soldier.current_status || 'לא ידוע',
        tefillinBarcode: soldierTefillin?.barcode,
        tefillinStatus: soldierTefillin?.status,
        lastContactDate: soldier.last_contact_date,
        nextContactDate: soldier.next_contact_date,
        createdAt: soldier.created_at
      };
    });
    
    return reports;
  }
  
  async getTefillinReport(filters: ReportFilters): Promise<TefillinReport[]> {
    let tefillin = await tefillinRepo.getAll();
    
    if (filters.status && filters.status !== 'all') {
      tefillin = tefillin.filter(t => t.status === filters.status);
    }
    
    if (filters.locationIds && filters.locationIds.length > 0) {
      tefillin = tefillin.filter(t => 
        t.locationId && filters.locationIds!.includes(t.locationId.toString())
      );
    }
    
    const locations = await locationsRepo.getAll();
    const soldiers = await soldiersRepo.getAll();
    
    const reports: TefillinReport[] = tefillin.map(t => {
      const location = locations.find(l => l.id === t.locationId);
      const soldier = soldiers.find(s => s.tefillin_id === t.id);
      
      return {
        tefillinId: t.id,
        barcode: t.barcode,
        status: t.status,
        locationName: location?.name,
        soldierName: soldier?.name,
        donorName: t.donorname,
        inMemoryOf: t.inmemoryof,
        scribeName: t.scribename,
        productionDate: t.productiondate,
        createdAt: t.createdat
      };
    });
    
    return reports;
  }
  
  async getLocationsReport(filters: ReportFilters): Promise<LocationReport[]> {
    let locations = await locationsRepo.getAll();
    
    if (filters.locationIds && filters.locationIds.length > 0) {
      locations = locations.filter(l => filters.locationIds!.includes(l.id.toString()));
    }
    
    const soldiers = await soldiersRepo.getAll();
    const tefillin = await tefillinRepo.getAll();
    const users = await usersRepo.getAll();
    const addresses = await addressesRepo.getAll();
    
    const reports: LocationReport[] = locations.map(location => {
      const locationSoldiers = soldiers.filter(s => s.location_id === location.id);
      const activeSoldiers = locationSoldiers.filter(s => s.current_status === 'active');
      const locationTefillin = tefillin.filter(t => t.locationId === location.id);
      const distributedTefillin = locationTefillin.filter(t => t.status === 'distributed');
      const availableTefillin = locationTefillin.filter(t => t.status === 'available');
      const rabbi = users.find(u => u.id === location.rabbi_id);
      const address = addresses.find(a => a.id === location.address_id);
      
      return {
        locationId: location.id,
        locationName: location.name,
        rabbiName: rabbi?.name,
        phone: location.phone,
        address: address ? `${address.street} ${address.house_number}, ${address.city}` : undefined,
        totalSoldiers: locationSoldiers.length,
        activeSoldiers: activeSoldiers.length,
        totalTefillin: locationTefillin.length,
        distributedTefillin: distributedTefillin.length,
        availableTefillin: availableTefillin.length,
        isActive: location.isactive || false
      };
    });
    
    return reports;
  }
  
  async getDonationsReport(filters: ReportFilters): Promise<DonationReport[]> {
    let donations = await donationsRepo.getAll();
    
    if (filters.startDate && filters.endDate) {
      donations = donations.filter(d =>
        d.created_at && 
        new Date(d.created_at) >= new Date(filters.startDate!) &&
        new Date(d.created_at) <= new Date(filters.endDate!)
      );
    }
    
    if (filters.donorName) {
      donations = donations.filter(d => 
        d.donor_name.toLowerCase().includes(filters.donorName!.toLowerCase())
      );
    }
    
    const reports: DonationReport[] = donations.map(donation => ({
      donationId: donation.id,
      donorName: donation.donor_name,
      email: donation.email,
      phone: donation.phone,
      totalAmount: 0,
      paymentStatus: donation.payment_status || 'pending',
      dedication: donation.dedication,
      createdAt: donation.created_at!,
      items: []
    }));
    
    return reports;
  }
  
  async getDistributionsReport(filters: ReportFilters): Promise<DistributionReport[]> {
    let distributions = await distributionsRepo.getAll();
    
    if (filters.startDate && filters.endDate) {
      distributions = distributions.filter(d =>
        d.date && 
        new Date(d.date) >= new Date(filters.startDate!) &&
        new Date(d.date) <= new Date(filters.endDate!)
      );
    }
    
    if (filters.locationIds && filters.locationIds.length > 0) {
      distributions = distributions.filter(d => 
        d.location_id && filters.locationIds!.includes(d.location_id.toString())
      );
    }
    
    const soldiers = await soldiersRepo.getAll();
    const tefillin = await tefillinRepo.getAll();
    const locations = await locationsRepo.getAll();
    
    const reports: DistributionReport[] = distributions.map(distribution => {
      const soldier = soldiers.find(s => s.id === distribution.soldier_id);
      const tefillinItem = tefillin.find(t => t.id === distribution.tefillin_id);
      const location = locations.find(l => l.id === distribution.location_id);
      
      return {
        distributionId: distribution.id,
        soldierName: soldier?.name || 'לא ידוע',
        tefillinBarcode: tefillinItem?.barcode || 'לא ידוע',
        locationName: location?.name || 'לא ידוע',
        distributionDate: distribution.date || new Date(),
        photoUrl: distribution.drive_url,
        description: distribution.description,
        isPublishable: distribution.is_publishable
      };
    });
    
    return reports;
  }
  
  async getSystemReport(filters: ReportFilters): Promise<SystemReport> {
    const [soldiers, tefillin, locations, donations, distributions] = await Promise.all([
      soldiersRepo.getAll(),
      tefillinRepo.getAll(),
      locationsRepo.getAll(),
      donationsRepo.getAll(),
      distributionsRepo.getAll()
    ]);
    
    const activeSoldiers = soldiers.filter(s => s.current_status === 'active');
    const availableTefillin = tefillin.filter(t => t.status === 'available');
    const distributedTefillin = tefillin.filter(t => t.status === 'distributed');
    const activeLocations = locations.filter(l => l.isactive);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentDistributions = distributions.filter(d => 
      d.date && new Date(d.date) >= weekAgo
    );
    
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const recentSoldiers = soldiers.filter(s => 
      new Date(s.created_at) >= monthAgo
    );
    
    const totalDonationAmount = 0;
    
    const topLocations = (await this.getLocationsReport(filters))
      .sort((a, b) => b.totalSoldiers - a.totalSoldiers)
      .slice(0, 5);
    
    const recentSoldiersReport = (await this.getSoldiersReport({
      ...filters,
      startDate: monthAgo.toISOString().split('T')[0]
    })).slice(0, 10);
    
    return {
      totalSoldiers: soldiers.length,
      activeSoldiers: activeSoldiers.length,
      totalTefillin: tefillin.length,
      availableTefillin: availableTefillin.length,
      distributedTefillin: distributedTefillin.length,
      totalLocations: locations.length,
      activeLocations: activeLocations.length,
      totalDonations: donations.length,
      totalDonationAmount,
      recentDistributions: recentDistributions.length,
      topLocations,
      recentSoldiers: recentSoldiersReport
    };
  }
  
  async getSoldierStatusReport(filters: ReportFilters) {
    const statusHistoryRepo = new BaseRepository('soldier_status_history');
    let statusHistory = await statusHistoryRepo.getAll();
    
    if (filters.startDate && filters.endDate) {
      statusHistory = statusHistory.filter((h: any) =>
        h.changed_at && 
        new Date(h.changed_at) >= new Date(filters.startDate!) &&
        new Date(h.changed_at) <= new Date(filters.endDate!)
      );
    }
    
    if (filters.soldierIds && filters.soldierIds.length > 0) {
      statusHistory = statusHistory.filter((h: any) => 
        h.soldier_id && filters.soldierIds!.includes(h.soldier_id)
      );
    }
    
    return statusHistory;
  }
  
  async getReport(reportType: string, filters: ReportFilters) {
    switch (reportType) {
      case 'soldiers':
        return this.getSoldiersReport(filters);
      case 'tefillin':
        return this.getTefillinReport(filters);
      case 'locations':
        return this.getLocationsReport(filters);
      case 'donations':
        return this.getDonationsReport(filters);
      case 'distributions':
        return this.getDistributionsReport(filters);
      case 'system':
        return this.getSystemReport(filters);
      case 'soldier-status':
        return this.getSoldierStatusReport(filters);
      default:
        throw new Error(`Invalid report type: ${reportType}`);
    }
  }
  
  async reportExists(reportType: string, filters: ReportFilters): Promise<boolean> {
    const validReportTypes = [
      'soldiers', 
      'tefillin', 
      'locations', 
      'donations', 
      'distributions', 
      'system', 
      'soldier-status'
    ];
    return validReportTypes.includes(reportType);
  }
}

export const reportsService = new ReportsService();
