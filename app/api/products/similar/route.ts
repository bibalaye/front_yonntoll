import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json({ error: 'L\'ID de catégorie est requis' }, { status: 400 });
    }

    const produitsSimilaires = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
      include: {
        category: true,
        subCategory: true,
        images: true,
      },
    });

    return NextResponse.json(produitsSimilaires);
  } catch (erreur) {
    console.error('Erreur lors de la récupération des produits similaires:', erreur);
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 });
  }
}
