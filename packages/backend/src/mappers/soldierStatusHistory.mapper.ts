import { SoldierStatusHistory } from '../../../../types/soldiers';
import { SoldierStatusHistoryDto } from '../dto/soldier.dto';

export const mapSupabaseToStatusHistory = (raw: any): SoldierStatusHistory => {
  return {
    id: raw.id,
    soldier_id: raw.soldier_id,
    previous_status: raw.previous_status ?? undefined,
    new_status: raw.new_status,
    notes: raw.notes ?? undefined,
    changed_at: raw.changed_at ?? undefined,
  };
};


export const mapStatusHistoryToSupabase = (status: SoldierStatusHistory): any => {
  return {
    id: status.id ?? undefined, // אם משתמשים ב־insert ייתכן שצריך להשמיט
    soldier_id: status.soldier_id,
    previous_status: status.previous_status ?? null,
    new_status: status.new_status,
    notes: status.notes ?? null,
    changed_at: status.changed_at ?? null,
  };
};

export const mapStatusHistoryToDto = (
  raw: SoldierStatusHistory
): SoldierStatusHistoryDto => {
  return {
    previousStatus: raw.previous_status,
    newStatus: raw.new_status,
    notes: raw.notes,
    changedAt: raw.changed_at ? new Date(raw.changed_at) : undefined,
  };
};


export const mapDtoToStatusHistory = (
  dto: SoldierStatusHistoryDto,
  soldierId: string
): SoldierStatusHistory => {
  return {
    soldier_id: soldierId,
    previous_status: dto.previousStatus,
    new_status: dto.newStatus,
    notes: dto.notes,
    changed_at: dto.changedAt ? dto.changedAt.toISOString() : undefined,
  };
};

