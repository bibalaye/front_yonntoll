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
    let name: string;
    let description: string;
    let price: number;
    let categoryId: number;
    let subCategoryId: number;
    let agripreneurId: number;
    let stock: number;

    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string;
      description = formData.get('description') as string;
      price = parseFloat(formData.get('price') as string);
      categoryId = parseInt(formData.get('categoryId') as string);
      subCategoryId = parseInt(formData.get('subCategoryId') as string);
      agripreneurId = parseInt(formData.get('agripreneurId') as string);
      stock = parseInt(formData.get('stock') as string);
    } else {
      const body = await request.text();
      const data = new URLSearchParams(body);
      name = data.get('name') as string;
      description = data.get('description') as string;
      price = parseFloat(data.get('price') as string);
      categoryId = parseInt(data.get('categoryId') as string);
      subCategoryId = parseInt(data.get('subCategoryId') as string);
      agripreneurId = parseInt(data.get('agripreneurId') as string);
      stock = parseInt(data.get('stock') as string);
    }

    if (!name) {
      return NextResponse.json({ error: 'Le nom du produit est requis' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        description,
        price,
        categoryId,
        subCategoryId,
        agripreneurId,
        stock
      }
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du produit' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    return handleError(error, 'Erreur lors de la suppression du produit:');
  }
}

function handleError(error: unknown, message: string) {
  console.error(message, error);
  return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
}
