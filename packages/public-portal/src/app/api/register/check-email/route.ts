import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('📥 בקשה התקבלה ל-check-email');

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    console.log('🔍 אימייל שהתקבל:', email);

    if (!email) {
      console.log('⚠️ לא סופק אימייל');
      return NextResponse.json({ exists: false });
    }

    const existingSoldier = await prisma.soldiers.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    console.log('🧍‍♂️ נמצא חייל?:', !!existingSoldier);

    return NextResponse.json({ exists: !!existingSoldier });

  } catch (error) {
    console.error('❌ שגיאה בשרת:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
