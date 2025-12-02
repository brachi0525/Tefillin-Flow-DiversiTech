import { SoldierStatusHistory } from '../../../../types/soldiers';
import { Tefillin } from '../../../../types/tefillin';
import { SoldierDto, SoldierResponseDto, StatisticsDto, SoldierCommentsDto } from '../dto/soldier.dto';
import { SoldierStatus, Soldier } from '../../../../types/soldiers'
import { BaseRepository } from '../repositories/baseRepository';
import { CommentCategory, SoldierComment } from '../../../../types/comments';

import { buildFullSoldierDto, mapSupabaseToSoldier, mapSoldierToDto, mapDtoToSoldier, mapSoldierToSupabase, mapSoldierDtoToResponse } from '../mappers/soldier.mapper';
import { sendWhatsAppMessage } from './sendWatsappService';


const soldierRepo = new BaseRepository<SoldierResponseDto>("soldiers");
const tefilinRepository = new BaseRepository<Tefillin>("tefillin");
const statusHistoryRepo = new BaseRepository<SoldierStatusHistory>("soldier_status_history");
const commentRepo = new BaseRepository<SoldierComment>("soldier_comments");

export class SoldierService {
  static async getAllSoldiers(): Promise<SoldierResponseDto[]> {
    console.log("in getAllSoldiers");
    return await soldierRepo.getAll();
  }


  static async filterSoldiersWithSearch({
    filters = {},
    search = {},
  }: {
    filters?: Partial<SoldierResponseDto>;
    search?: Partial<Record<keyof SoldierResponseDto, string>>;
  }): Promise<SoldierResponseDto[]> {
    return await soldierRepo.filterWithSearch(filters, search);
  }

  static async getSoldiersWithOptionalFilterAndSearch(
    query: any,
    user?: { role?: string; location_id?: string }
  ): Promise<SoldierResponseDto[]> {
    let filters: Partial<SoldierResponseDto> = {};
    let search: Partial<Record<keyof SoldierResponseDto, string>> = {};

    try {
      if (typeof query.filters === 'string') {
        filters = JSON.parse(query.filters);
      } else if (typeof query.filters === 'object' && query.filters !== null) {
        filters = query.filters;
      }

      if (typeof query.search === 'string') {
        search = JSON.parse(query.search);
      } else if (typeof query.search === 'object' && query.search !== null) {
        search = query.search;
      }
      if (user?.role === 'RABBI' && user.location_id) {
        filters.locationId = user.location_id;

      }
    } catch (err) {
      console.warn('בעיה בפענוח פרמטרי סינון/חיפוש:', err);

    }

    const hasFiltersOrSearch = Object.keys(filters).length > 0 || Object.keys(search).length > 0;

    if (hasFiltersOrSearch) {
      return await this.filterSoldiersWithSearch({ filters, search });
    }

    return await this.getAllSoldiers();
  }

  static async calculateStatistics(): Promise<StatisticsDto> {
    const soldiers = await this.getAllSoldiers();
    const registeredCount = soldiers.filter(s => s.currentStatus === 'registered').length;
    const receivedCount = soldiers.filter(s => s.currentStatus === 'received').length;
    const totalDaysWorn = this.calculateTotalDaysWorn(soldiers);
    const averageDaysToReceive = this.calculateAverageDaysToReceive(soldiers);
    const monthlyDistributedCount = this.calculateMonthlyDistributedCount(soldiers);
    const weeklyDistributedCount = this.calculateWeeklyDistributedCount(soldiers);
    return {
      registeredCount,
      receivedCount,
      totalDaysWorn,
      averageDaysToReceive,
      monthlyDistributedCount,
      weeklyDistributedCount,
    };
  }

  private static calculateTotalDaysWorn(soldiers: SoldierDto[]): number {
    let totalDays = 0;

    soldiers.forEach((soldier) => {
      const daysSinceReceived = this.calculateDaysSinceReceived(soldier);
      totalDays += daysSinceReceived;
    });

    return totalDays;
  }

  private static calculateDaysSinceReceived(soldier: SoldierDto): number {
    let receivedDate: Date | null = null;
    if (soldier.lastContactDate) {
      receivedDate = new Date(soldier.lastContactDate);
    } else {
      console.error("lastContactDate is undefined");
    }
    const today = new Date();
    const totalDays = receivedDate ? Math.floor((today.getTime() - receivedDate.getTime()) / (1000 * 3600 * 24)) : 0;

    const weeksPassed = Math.floor(totalDays / 7);
    const yearsPassed = Math.floor(totalDays / 365);
    const holidaysDays = yearsPassed * 30 + (totalDays % 365) / 2;

    return totalDays - weeksPassed - holidaysDays;
  }

  private static calculateAverageDaysToReceive(soldiers: SoldierDto[]): number {
    const receiveTimes = soldiers
 
      .filter(s => s.currentStatus === 'received')
      .map(s => {
        if (s.lastContactDate && s.nextContactDate) {
          const lastContactDate = new Date(s.lastContactDate);
          const nextContactDate = new Date(s.nextContactDate);
          return (lastContactDate.getTime() - nextContactDate.getTime()) / (1000 * 3600 * 24);
        }
        return 0;
      })
      .filter(time => time !== 0);

    const totalReceiveTime = receiveTimes.reduce((acc, time) => acc + time, 0);
    return receiveTimes.length > 0 ? totalReceiveTime / receiveTimes.length : 0;
  }

  private static calculateMonthlyDistributedCount(soldiers: SoldierDto[]): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return soldiers.filter(s =>

      s.currentStatus === 'received' &&
      s.lastContactDate !== undefined &&
      new Date(s.lastContactDate) >= oneMonthAgo
    ).length;
  }

  private static calculateWeeklyDistributedCount(soldiers: SoldierDto[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return soldiers.filter(s =>
   s.currentStatus === 'received' &&

      s.lastContactDate !== undefined &&
      new Date(s.lastContactDate) >= oneWeekAgo
    ).length;
  }

  static async createSoldier(data: SoldierDto): Promise<SoldierResponseDto> {

    const rawSoldier = mapDtoToSoldier(data);
    const supabaseSoldier = mapSoldierToSupabase(rawSoldier);

    const email = supabaseSoldier.email.trim().toLowerCase();

    const existing = await soldierRepo.findOne({ email });

    if (existing) {
      const error: any = new Error("Soldier with this email already exists");
      error.status = 409;
      throw error;
    }

    const now = new Date();

    try {
      const result = await soldierRepo.insert({
        ...supabaseSoldier,
        email,
        created_at: now,
        updated_at: now,
      });

      if (!result) {
        const error: any = new Error("Failed to create soldier");
        error.status = 500;
        throw error;
      }

      const savedSoldier = mapSupabaseToSoldier(result);
      const responseDto = mapSoldierToDto(savedSoldier);
      const resultResponse = mapSoldierDtoToResponse(responseDto)
      return resultResponse;

    } catch (dbErr: any) {
      if (dbErr.code === "23505") {
        const error: any = new Error("Soldier with this email already exists (DB unique violation)");
        error.status = 409;
        throw error;
      }

      throw dbErr;
    }
  }


  static async updateSoldier(
    soldierId: string,
    updates: Partial<SoldierDto>
  ): Promise<SoldierResponseDto> {

    const existing = await soldierRepo.getById(soldierId); 
    if (!existing) throw new Error("Soldier not found");

    const rawExisting=mapSupabaseToSoldier(existing);
    const dtoExisting=mapSoldierToDto(rawExisting);

    const fullDto: SoldierDto = buildFullSoldierDto(updates, dtoExisting);

    const rawSoldier = mapDtoToSoldier(fullDto);
    rawSoldier.id = soldierId;
    const date = new Date(existing.created_at );
    rawSoldier.createdAt=date;

    const supabaseSoldier = mapSoldierToSupabase(rawSoldier);

    const updated = await soldierRepo.update(soldierId, {
      ...supabaseSoldier,
      updated_at: new Date(),
    });


    if (!updated) throw new Error('Failed to update soldier');

    const savedSoldier = mapSupabaseToSoldier(updated);
    const responseDto = mapSoldierToDto(savedSoldier);
    const resultResponse = mapSoldierDtoToResponse(responseDto)
    resultResponse.created_at=date

    return resultResponse;
  }

  static async deleteSoldier(soldierId: string): Promise<void> {
    try {
      await soldierRepo.delete(soldierId);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw new Error("Soldier not found");
      }
      throw error;
    }
  }

  static async changeSoldierStatus(soldierId: string, newStatus: SoldierStatus, notes?: string): Promise<SoldierResponseDto> {
    const soldier = await soldierRepo.getById(soldierId);
    if (!soldier) throw new Error("Soldier not found");

    if (soldier.currentStatus === newStatus) {
      throw new Error(`Status is already '${newStatus}'`);
    }

    const updated = await soldierRepo.update(soldierId, {
      currentStatus: newStatus,
      updated_at: new Date(),
    });

    if (!updated) throw new Error("Failed to update status");
if( updated.currentStatus === 'approved'|| updated.currentStatus === 'rejected'){

 let message = '';

  switch (updated.currentStatus) {
    case 'rejected':
      message = `שלום ${updated.name},\nלצערינו נדחתה בקשתך לקבלת תפילין.\nחב״ד תפן`;
      break;
    case 'approved':
      message = `שלום ${updated.name},\nאושרה בקשתך לקבלת התפילין!\nאנא הסדר תשלום בקישור:\nhttps://tefilin.diversitech.co.il`;
      break;

  }
        await sendWhatsAppMessage('972559571223', message );
}
    await statusHistoryRepo.insert({
      soldier_id: soldierId,
      previous_status: soldier.currentStatus,
      new_status: newStatus,
      notes,
      changed_at: new Date().toISOString(),
    });


    return updated;
  }
  static async filterSoldiers(filters: Partial<SoldierResponseDto>): Promise<SoldierResponseDto[]> {
    return await soldierRepo.filter(filters);
  }
  static async assignSoldierToLocation(locationId: string, soldierId: string): Promise<void> {
    if (!locationId || !soldierId) {
      throw new Error("Invalid parameters");
    }
    const update = {
      id: soldierId,
      location_id: locationId,
      updated_at: new Date(),
    };

    const result = await soldierRepo.update(update.id, update);
    if (!result) {
      throw new Error("Failed to assign soldier");
    }
  }
  static async assignTefillinToSoldier(soldierId: string, tefillinId: string) {
    const soldier = await soldierRepo.getById(soldierId);
    if (!soldier) throw new Error("Soldier not found");

    const soldiersWithTefillin = await soldierRepo.filter({ tefillinId });
    if (soldiersWithTefillin.length > 0) throw new Error("Tefillin already assigned to another soldier");

    const updated = await soldierRepo.update(soldierId, {
      tefillinId,
      updated_at: new Date(),
    });

    if (!updated) throw new Error("Failed to assign tefillin");

    return updated;
  }

  static async addSoldierComment(data: { soldierId: string; userId?: string; content: string; category?: string; visibleToAll?: boolean }): Promise<SoldierComment> {
    const now = new Date();

    const newComment: SoldierCommentsDto = {
      soldier_id: data.soldierId,
      user_id: data.userId ?? null,
      content: data.content,
      category: data.category as CommentCategory | undefined,
      visible_to_all: data.visibleToAll ?? true,
    };

    const inserted = await commentRepo.insert({
      ...newComment,
    } as SoldierCommentsDto);

    if (!inserted) throw new Error("Failed to add comment");
    return inserted;
  }

  static async getSoliderByStatus(status: SoldierStatus): Promise<SoldierDto[]> {

    const filters = { currentStatus: status }
    
    const soldiers = await soldierRepo.filter(filters);
    return soldiers;

  }

  static async getPendingSoldiers(): Promise<Soldier[]> {

    const pendingStatuses = ['registered']; 
    return soldierRepo.getByStatuses(pendingStatuses);
  }
  
static async getSoldierByTefillinId(tefillinId: string): Promise<SoldierResponseDto | null> {
    if (!tefillinId) {
      console.warn('Empty tefillinId received!');
      return null;
    }
    const soldier = await soldierRepo.findOne({ tefillin_id: tefillinId } as any);
    if (!soldier) {
      console.log('No soldier found with tefillin_id:', tefillinId);
    } else {
      console.log('Found soldier:', soldier);
    }
    return soldier;
  }
}