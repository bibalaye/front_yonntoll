import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvée' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du Produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, description, price, categoryId,subCategoryId, agripreneurId, stock } = body;

    if (!name) {
      return NextResponse.json({ error: 'Le nom du Produit est requis' }, { status: 400 });
    }

    const updatedproduct = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: { name, description, price, categoryId,subCategoryId, agripreneurId, stock }, // Utilisation correcte de imageUrl
    });

    return NextResponse.json(updatedproduct);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du Produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Produit supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du Produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}