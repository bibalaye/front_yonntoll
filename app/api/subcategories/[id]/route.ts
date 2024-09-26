import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!subCategory) {
      return NextResponse.json({ error: 'Sous-catégorie non trouvée' }, { status: 404 });
    }

    return NextResponse.json(subCategory);
  } catch (error) {
    console.error('Erreur lors de la récupération de la sous-catégorie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    let name: string;
    let categoryId: number;

    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string;
      categoryId = parseInt(formData.get('categoryId') as string);
    } else {
      const body = await request.text();
      const data = new URLSearchParams(body);
      name = data.get('name') as string;
      categoryId = parseInt(data.get('categoryId') as string);
    }

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Le nom et l\'ID de la catégorie parente sont requis' }, { status: 400 });
    }

    const updatedSubCategory = await prisma.subCategory.update({
      where: { id: parseInt(params.id) },
      data: { name, categoryId },
    });

    return NextResponse.json(updatedSubCategory, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la sous-catégorie:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de la sous-catégorie' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.subCategory.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Sous-catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la sous-catégorie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
