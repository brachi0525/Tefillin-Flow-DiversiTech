import { Tefillin, TefillinStatus } from '../../../../types/tefillin';
import { Soldier, SoldierStatus } from '../../../../types/soldiers';
import { TefillinDto } from '../dto/teffilin.dto';
import { BaseRepository } from '../repositories/baseRepository';
import { generateTefillinQr } from '../../../ETL/src/integrations/qr';
import { buffer } from 'stream/consumers';

import { ParsedQs } from 'qs'; 

const tefilinRepository = new BaseRepository<Tefillin>('tefillin');
const soldierRepository = new BaseRepository<Soldier>('soldiers');
export class tefillinService {
static async moveTefilinService(tefilinId: string, newLocationId:Partial<Tefillin>) {
     const result = await tefilinRepository.update(tefilinId, newLocationId);
    return result;
}

static async addTefillin(dto: TefillinDto) {
  const tefillin: Omit<Tefillin, 'id' | 'createdAt' | 'updatedAt'> = {
    ...dto,
    status: dto.status as Tefillin['status']
  };

  const insertResult = await tefilinRepository.insert(tefillin as Tefillin);
  const insertId = insertResult?.id;
  if (!insertId) {
    throw new Error('The entry was successful but no ID was received');
  }
  const qrCode = await generateTefillinQr(insertId);

  return qrCode;
}

static async updateTefillinStatus(tefillinId: string, status: TefillinStatus) {
    const updatedTefillin = await tefilinRepository.update(tefillinId, { status });
  if (status === TefillinStatus.DISTRIBUTED) {
        const soldiers = await soldierRepository.filter({ tefillinId: tefillinId });
    if (soldiers.length > 0) {
      await soldierRepository.update(soldiers[0].id, { currentStatus: SoldierStatus.RECEIVED });
    }
  }

  return updatedTefillin;
}

static async markTefillinAsCompleted(tefillinId: string) {
  return await tefillinService.updateTefillinStatus(tefillinId, TefillinStatus.DISTRIBUTED);
}
static async filterTefillinByStatusAndLocation(
  status?: TefillinStatus,
  locationId?: string
) {
  const filters: Partial<Tefillin> = {};
  if (status && Object.values(TefillinStatus).includes(status)) {
    filters.status = status;
  }
  if (locationId) {
    filters.locationId = locationId;
  }
  return await tefilinRepository.filter(filters);
}

 static async getTefillinByStatus(status: TefillinStatus): Promise<TefillinDto[]> {
    try {
        const filters = {status };
        const tefilins = await tefilinRepository.filter(filters);
        return tefilins;
    } catch (error) {
        console.error("Error fetching tefillin by status:", error);
        throw new Error("Failed to fetch tefillin");
    }
}
static async getTefillinById(tefillinId: string): Promise<TefillinDto> {
    try {
      const tefillin = await tefilinRepository.getById(tefillinId);
      if (!tefillin) {
        throw new Error("Tefillin not found");
      }
      return tefillin;
    } catch (error) {
      console.error("Error fetching tefillin by ID:", error);
      throw new Error("Failed to fetch tefillin");
    }
  };
};

