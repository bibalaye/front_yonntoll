import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const productId = formData.get('productId');
    const images = formData.getAll('images');

    if (!productId || !images || images.length === 0) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const uploadPromises = images.map(async (image: any) => {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'product_images' },
          async (error, result) => {
            if (error) {
              reject(error);
            } else {
              try {
                const productImage = await prisma.productImage.create({
                  data: {
                    productId: Number(productId),
                    imageUrl: result?.secure_url || '',
                  },
                });
                resolve(productImage);
              } catch (err) {
                reject(err);
              }
            }
          }
        ).end(buffer);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return NextResponse.json({ message: 'Images ajoutées avec succès', images: uploadedImages });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des images:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'ajout des images' }, { status: 500 });
  }
}
