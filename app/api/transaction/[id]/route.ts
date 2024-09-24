import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { userType } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { userType },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' }, { status: 500 });
  }
}