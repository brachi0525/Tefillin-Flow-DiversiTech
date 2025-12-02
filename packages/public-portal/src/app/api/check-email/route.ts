import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const existing = await prisma.soldiers.findUnique({
      where: { email },
    });

    return NextResponse.json({ exists: !!existing });
  } catch (error) {
    console.error("שגיאה בבדיקת אימייל:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
