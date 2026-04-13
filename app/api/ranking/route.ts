import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ranking = await prisma.userscore.findMany({
      orderBy: {
        score: 'desc',
      },
      take: 100, // Mostramos los 100 mejores
    });

    return NextResponse.json(ranking);
  } catch (error) {
    console.error('Error fetching ranking:', error);
    return NextResponse.json([], { status: 500 });
  }
}
