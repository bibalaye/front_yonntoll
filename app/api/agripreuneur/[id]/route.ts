import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { farmName, description, accountName, accountNumber, bankName } = await req.json();

    const updatedAgripreneur = await prisma.agripreneur.update({
      where: { id: parseInt(id, 10) },
      data: { farmName, description, accountName, accountNumber, bankName },
    });

    return NextResponse.json(updatedAgripreneur);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' }, { status: 500 });
  }
}
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const agripreneur = await prisma.agripreneur.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!agripreneur) {
      return NextResponse.json({ error: 'Agripreneur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(agripreneur);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'agripreneur:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'agripreneur' }, { status: 500 });
  }
}
