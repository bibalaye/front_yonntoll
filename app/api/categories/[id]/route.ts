import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
};

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
    return handleError(error, 'Erreur lors de la récupération de la catégorie:');
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File | null;

    if (!name) {
      return NextResponse.json({ error: 'Le nom de la catégorie est requis' }, { status: 400 });
    }

    let imageUrl;
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'category_images' },
          (error, result) => error ? reject(error) : resolve(result)
        ).end(buffer);
      });
      imageUrl = (uploadResult as any).secure_url;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: { name, imageUrl },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return handleError(error, 'Erreur lors de la mise à jour de la catégorie:');
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(params.id) },
      include: { products: { select: { id: true }, take: 1 } },
    });

    if (category?.products.length) {
      return NextResponse.json({ error: 'La catégorie contient des produits' }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    return handleError(error, 'Erreur lors de la suppression de la catégorie:');
  }
}