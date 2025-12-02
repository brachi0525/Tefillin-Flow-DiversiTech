import { PrismaClient } from '@prisma/client';
import { SoldierDto, SoldierResponseDto } from '../../../../../backend/src/dto/soldier.dto';

const prisma = new PrismaClient();

export async function createSoldier(data: SoldierDto): Promise<SoldierResponseDto> {
    const email = data.email.trim().toLowerCase();

    const existing = await prisma.soldiers.findUnique({
        where: { email },
    });

    if (existing) {
        const error: any = new Error('Soldier with this email already exists');
        error.status = 409;
        throw error;
    }

    try {
        const now = new Date();

        const dbResult = await prisma.soldiers.create({
            data: {
                name: data.name,
                email,
                phone: data.phone,
                address: data.address,
                mothers_name: data.mothersName,
                dominant_hand: data.dominantHand,
                form_filler_name: data.formFillerName,
                form_filler_phone: data.formFillerPhone,
                form_filler_relationship: data.formFillerRelationship,
                current_status: data.currentStatus,
                location_id: data.locationId,
                tefillin_id: data.tefillinId,
                last_contact_date: data.lastContactDate,
                next_contact_date: data.nextContactDate,
            },
        });

        return {
            ...dbResult,
            ...data,
        } as SoldierResponseDto;
    } catch (err: any) {
        if (err.code === 'P2002') {
            const error: any = new Error('Soldier with this email already exists (DB unique violation)');
            error.status = 409;
            throw error;
        }
        throw err;
    }
}