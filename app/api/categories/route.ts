import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';// Assurez-vous que Prisma est bien importé

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File | null;

    console.log('Nom de la catégorie:', name);
    console.log('Image reçue:', image);

    if (!name) {
      return NextResponse.json({ error: 'Le nom de la catégorie est requis' }, { status: 400 });
    }

    let imageUrl = null;
    if (image) {
      // Création du dossier d'upload si nécessaire
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      // Sauvegarde de l'image
      const buffer = Buffer.from(await image.arrayBuffer());
      const imageName = `${Date.now()}-${image.name}`;
      const imagePath = path.join(uploadDir, imageName);
      await fs.writeFile(imagePath, buffer);

      imageUrl = `/uploads/${imageName}`;
      console.log('Image enregistrée à:', imageUrl);
    } else {
      console.log('Aucune image reçue ou le type de l\'image est incorrect');
    }

    // Sauvegarde dans la base de données
    const newCategory = await prisma.category.create({
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
