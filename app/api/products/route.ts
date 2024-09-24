import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Gère les requêtes GET pour récupérer tous les produits
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

// Gère les requêtes POST pour ajouter un produit
export async function POST(req: Request) {
  try {
    const { name, description, price, categoryId, subcategoryId, agripreneurId, stock } = await req.json();
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category: { connect: { id: categoryId } },
        subCategory: { connect: { id: subcategoryId } },
        agripreneur: { connect: { id: agripreneurId } },
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'ajout du produit' }, { status: 500 });
  }
}
