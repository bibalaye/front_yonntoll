import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('_page') || '1');
    const perPage = parseInt(searchParams.get('_perPage') || '10');
    const sortField = searchParams.get('_sort') || 'id';
    const sortOrder = searchParams.get('_order') || 'ASC';
    const filter = searchParams.get('filter') ? JSON.parse(searchParams.get('filter') || '{}') : {};
    
    // Vérification et correction du tri sur les champs imbriqués
    let orderBy: any = {};
    if (sortField.includes('.')) {
      const [parentField, childField] = sortField.split('.');
      orderBy = {
        [parentField]: {
          [childField]: sortOrder.toLowerCase()
        }
      };
    } else {
      orderBy = {
        [sortField]: sortOrder.toLowerCase()
      };
    }

    const skip = (page - 1) * perPage;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true,
          subCategory: true,
          images: true,
          agripreneur: true,
        },
        where: filter,
        skip,
        take: perPage,
        orderBy,
      }),
      prisma.product.count({ where: filter }),
    ]);

    return NextResponse.json(products, {
      headers: {
        'X-Total-Count': total.toString(),
        'Access-Control-Expose-Headers': 'X-Total-Count',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des produits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const categoryId = parseInt(formData.get('categoryId') as string);
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const agripreneurId = parseInt(formData.get('agripreneurId') as string);
    const subCategoryId = parseInt(formData.get('subCategoryId') as string);
    const images = formData.getAll('images') as File[];

    if (!name || !categoryId || !price || !stock || !agripreneurId || !subCategoryId) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        price,
        stock,
        agripreneurId,
        subCategoryId
      }
    });

    const uploadPromises = images.map(async (image) => {
      const buffer = Buffer.from(await image.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      return prisma.productImage.create({
        data: {
          productId: newProduct.id,
          imageUrl: (result as any).secure_url
        }
      });
    });

    await Promise.all(uploadPromises);

    const productWithImages = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: { images: true }
    });

    return NextResponse.json(productWithImages, { status: 201 });
  } catch (error) {
    console.error('Erreur détaillée lors de la création du produit:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du produit' }, { status: 500 });
  }
}
