import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.email) {
      return NextResponse.json({ message: 'כתובת מייל חסרה' }, { status: 400 });
    }

    const existing = await prisma.soldiers.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'כתובת מייל זו כבר קיימת' },
        { status: 409 }
      );
    }

    const newSoldier = await prisma.soldiers.create({
      data: {
        ...data,
       created_at: new Date(),
updated_at: new Date(),

      },
    });

    return NextResponse.json(newSoldier, { status: 201 });

  } catch (error) {
    console.error('שגיאה בשרת:', error);
    return NextResponse.json(
      { message: 'שגיאה בשרת' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const soldiers = await prisma.soldiers.findMany();
    return NextResponse.json(soldiers);
  } catch (error) {
    console.error('שגיאה בשליפת חיילים:', error);
    return NextResponse.json(
      { message: 'שגיאה בשליפת חיילים' },
      { status: 500 }
    );
  }
}
