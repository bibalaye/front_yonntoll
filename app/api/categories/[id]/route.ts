import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

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
    let name: string;
    let image: File | null = null;

    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string;
      image = formData.get('image') as File | null;
    } else {
      const body = await request.text();
      const data = new URLSearchParams(body);
      name = data.get('name') as string;
    }

    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
    }

    let imageUrl;

    if (image) {
      const buffer = await image.arrayBuffer();
      const stream = streamifier.createReadStream(Buffer.from(buffer));

      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'categories' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.pipe(uploadStream);
      });

      const uploadResult = await uploadPromise as { secure_url: string };
      imageUrl = uploadResult.secure_url;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        ...(imageUrl && { imageUrl })
      }
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de la catégorie' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(params.id) },
      include: { products: { select: { id: true }, take: 1 } },
    });

    if (category?.products.length) {
      return NextResponse.json({ error: 'La catégorie contient des produits ou sous catégories' }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    return handleError(error, 'Erreur lors de la suppression de la catégorie:');
  }
}