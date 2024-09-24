import { prisma } from '@/app/lib/prisma';

export async function getSubCategoriesByCategoryId(categoryId: number) {
  try {
    const subCategories = await prisma.subCategory.findMany({
      where: {
        categoryId: categoryId
      }
    });
    return subCategories;
  } catch (error) {
    console.error("Erreur lors de la récupération des sous-catégories:", error);
    throw new Error("Impossible de récupérer les sous-catégories");
  }
}
