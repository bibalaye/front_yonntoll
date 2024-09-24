import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ erreur: 'ID de catégorie invalide' }, { status: 400 });
    }

    const sousCategories = await prisma.subCategory.findMany({
      where: { categoryId: categoryId },
    });

    if (sousCategories.length === 0) {
      return NextResponse.json({ message: 'Aucune sous-catégorie trouvée pour cette catégorie' }, { status: 404 });
    }

    return NextResponse.json(sousCategories);
  } catch (erreur) {
    console.error('Erreur lors de la récupération des sous-catégories:', erreur);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
