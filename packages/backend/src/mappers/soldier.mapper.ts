import { Soldier, SoldierStatus } from '../../../../types/soldiers';
import { SoldierDto, SoldierResponseDto } from '../dto/soldier.dto';
import { randomUUID } from 'crypto';

export const mapSupabaseToSoldier = (raw: any): Soldier => {
    return {
        id: raw.id,
        name: raw.name,
        phone: raw.phone,
        email: raw.email ?? undefined,
        address: raw.address,
        mothersName: raw.mothers_name ?? undefined,
        dominantHand: raw.dominant_hand,

        formFillerName: raw.form_filler_name ?? undefined,
        formFillerPhone: raw.form_filler_phone ?? undefined,
        formFillerRelationship: raw.form_filler_relationship ?? undefined,

        currentStatus: raw.current_status as SoldierStatus,

        locationId: raw.location_id ?? undefined,
        tefillinId: raw.tefillin_id ?? undefined,

        lastContactDate: raw.last_contact_date ? new Date(raw.last_contact_date) : undefined,
        nextContactDate: raw.next_contact_date ? new Date(raw.next_contact_date) : undefined,

        createdAt: new Date(raw.created_at),
        updatedAt: new Date(raw.updated_at),

       
        statusHistory: [],
        payments: [],
        media: [],
        comments: [],
    };
};


export const mapSoldierToSupabase = (soldier: Soldier): any => {
    return {
        id: soldier.id,
        name: soldier.name,
        phone: soldier.phone,
        email: soldier.email ?? null,
        address: soldier.address,
        mothers_name: soldier.mothersName ?? null,
        dominant_hand: soldier.dominantHand,

        form_filler_name: soldier.formFillerName ?? null,
        form_filler_phone: soldier.formFillerPhone ?? null,
        form_filler_relationship: soldier.formFillerRelationship ?? null,

        current_status: soldier.currentStatus,

        location_id: soldier.locationId ?? null,
        tefillin_id: soldier.tefillinId ?? null,

        last_contact_date: soldier.lastContactDate ? soldier.lastContactDate.toISOString() : null,
        next_contact_date: soldier.nextContactDate ? soldier.nextContactDate.toISOString() : null,

        created_at: soldier.createdAt.toISOString(),
        updated_at: soldier.updatedAt.toISOString(),

      

    };
};


export const mapSoldierToDto = (soldier: Soldier): SoldierDto => {
  return {
    name: soldier.name,
    phone: soldier.phone,
    email: soldier.email ?? '',
    address: soldier.address,
    mothersName: soldier.mothersName,
    dominantHand: soldier.dominantHand,

    formFillerName: soldier.formFillerName,
    formFillerPhone: soldier.formFillerPhone,
    formFillerRelationship: soldier.formFillerRelationship,

    currentStatus: soldier.currentStatus, 

    locationId: soldier.locationId,
    tefillinId: soldier.tefillinId,

    lastContactDate: soldier.lastContactDate,
    nextContactDate: soldier.nextContactDate,

    comments: soldier.comments && soldier.comments.length > 0
        ? soldier.comments.map(c => c.content).join('\n\n')
        : '',
  };
};


//ahbh,h k- any
export const mapDtoToSoldier = (dto: SoldierDto ): Soldier => {
    const now = new Date();

    return {
        id: randomUUID(), 

        name: dto.name,
        phone: dto.phone,
        email: dto.email || undefined,
        address: dto.address,
        mothersName: dto.mothersName,
        dominantHand: dto.dominantHand,

        formFillerName: dto.formFillerName,
        formFillerPhone: dto.formFillerPhone,
        formFillerRelationship: dto.formFillerRelationship,

        currentStatus: dto.currentStatus,

        locationId: dto.locationId,
        tefillinId: dto.tefillinId,

        lastContactDate: dto.lastContactDate,
        nextContactDate: dto.nextContactDate,

        createdAt: now,
        updatedAt: now,

        
        statusHistory: [],
        payments: [],
        media: [],
        
        comments: dto.comments
            ? dto.comments
                .split(/\n{2,}/) 
                .map((c) => c.trim())
                .filter((c) => c.length > 0)
                .map((content) => ({
                    id: '', 
                    soldierID: '',
                    userID: '',
                    content,
                    visibleToAll: true,
                    createdAt: now,
                    updatedAt: now,
                }))
            : []
       
    };
};

export function mapSoldierDtoToResponse(
  dto: SoldierDto,
  extra?: {
    id?: string;
    created_at?: Date;
    updated_at?: Date;
  }
): SoldierResponseDto {
  return {
    ...dto,
    id: extra?.id,
    created_at: extra?.created_at ?? new Date(),
    updated_at: extra?.updated_at ?? new Date(),
    comments: dto.comments ?? '', 
  };
}


export function buildFullSoldierDto(
  partial: Partial<SoldierDto>,
  existing?: SoldierDto
): SoldierDto {
  return {
    name: partial.name ?? existing?.name ?? '',
    phone: partial.phone ?? existing?.phone ?? '',
    email: partial.email ?? existing?.email ?? '',
    address: partial.address ?? existing?.address ?? '',
    mothersName: partial.mothersName ?? existing?.mothersName,
    dominantHand: partial.dominantHand ?? existing?.dominantHand ?? 'right',
    formFillerName: partial.formFillerName ?? existing?.formFillerName,
    formFillerPhone: partial.formFillerPhone ?? existing?.formFillerPhone,
    formFillerRelationship: partial.formFillerRelationship ?? existing?.formFillerRelationship,
    currentStatus: partial.currentStatus ?? existing?.currentStatus ?? SoldierStatus.REGISTERED,
    locationId: partial.locationId ?? existing?.locationId,
    tefillinId: partial.tefillinId ?? existing?.tefillinId,
    lastContactDate: partial.lastContactDate ?? existing?.lastContactDate,
    nextContactDate: partial.nextContactDate ?? existing?.nextContactDate,
    comments: partial.comments ?? existing?.comments,
  };
};



