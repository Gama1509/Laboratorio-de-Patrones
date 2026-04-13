import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { nombre, score } = await request.json();

    if (!nombre || typeof score !== 'number') {
      return NextResponse.json({ error: 'Faltan datos requeridos (nombre o score válido)' }, { status: 400 });
    }

    const newScore = await prisma.userscore.create({
      data: {
        nombre,
        score,
      },
    });

    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Error al guardar la puntuación' }, { status: 500 });
  }
}
