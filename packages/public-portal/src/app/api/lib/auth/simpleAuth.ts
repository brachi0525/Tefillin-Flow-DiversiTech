import { NextApiRequest } from 'next';
import { prisma } from '../prisma/prisma';

export async function requireAdmin(req: NextApiRequest): Promise<string> {
  const email = req.headers['x-admin-email'] as string;
  
  if (!email) {
    throw new Error('Admin email required');
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        role: true,
        status: true
      }
    });

    if (!user || user.role !== 'admin' || user.status !== 'active') {
      throw new Error('Admin access required');
    }

    return email;
  } catch (error) {
    console.error('Auth error:', error);
    throw new Error('Admin access required');
  }
}