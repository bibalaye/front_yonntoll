import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Le nom et l\'ID de la catégorie parente sont requis' }, { status: 400 });
    }

    const newSubCategory = await prisma.subCategory.create({
      data: {
        name,
        categoryId: parseInt(categoryId),
      },
    });

    return NextResponse.json(newSubCategory, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la sous-catégorie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subCategories = await prisma.subCategory.findMany();
    return NextResponse.json(subCategories);
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
