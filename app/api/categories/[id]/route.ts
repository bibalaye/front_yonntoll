import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!category) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ error: 'Le nom de la catégorie est requis' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: { name, imageUrl }, // Utilisation correcte de imageUrl
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.category.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}