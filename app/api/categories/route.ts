import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('_page') || '1');
    const perPage = parseInt(searchParams.get('_perPage') || '10');
    const sortField = searchParams.get('_sort') || 'id';
    const sortOrder = searchParams.get('_order') || 'ASC';
    const filter = searchParams.get('filter') ? JSON.parse(searchParams.get('filter') || '{}') : {};

    const skip = (page - 1) * perPage;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: filter,
        skip,
        take: perPage,
        orderBy: {
          [sortField]: sortOrder.toLowerCase(),
        },
      }),
      prisma.category.count({ where: filter }),
    ]);

    return NextResponse.json(categories, {
      headers: {
        'X-Total-Count': total.toString(),
        'Access-Control-Expose-Headers': 'X-Total-Count',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des catégories' }, { status: 500 });
  }
}



cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File;

    if (!name || !image) {
      return NextResponse.json({ error: 'Le nom et l\'image sont requis' }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'categories' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const newCategory = await prisma.category.create({
      data: {
        name,
        imageUrl: (result as any).secure_url
      }
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Erreur détaillée lors de la création de la catégorie:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la catégorie' }, { status: 500 });
  }
}
