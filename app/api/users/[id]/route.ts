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
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'utilisateur' }, { status: 500 });
  }
}
