import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        category: true,
        subCategory: true,
        agripreneur: {
          include: {
            user: true
          }
        },
        images: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return handleError(error, 'Erreur lors de la récupération du produit:');
  }
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, description, price, categoryId, subCategoryId, agripreneurId, stock } = body;

    if (!name) {
      return NextResponse.json({ error: 'Le nom du produit est requis' }, { status: 400 });
    }

    // Vérification et conversion de l'ID
    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID de produit invalide' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { 
        name, 
        description, 
        price: price != null ? parseFloat(price) : undefined, 
        categoryId: categoryId != null ? parseInt(categoryId) : undefined, 
        subCategoryId: subCategoryId != null ? parseInt(subCategoryId) : undefined, 
        agripreneurId: agripreneurId != null ? parseInt(agripreneurId) : undefined, 
        stock: stock != null ? parseInt(stock) : undefined 
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

function handleError(error: unknown, arg1: string) {
  throw new Error('Function not implemented.');
}
