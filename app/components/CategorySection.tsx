import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

const CategorySection: React.FC = React.memo(() => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const renderCategoryImage = (category: Category) => (
    <Image 
      className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 mb-1 sm:mb-2 md:mb-3"
      src={category.imageUrl || '/logo.png'}
      alt={category.name}
      width={88} 
      height={88}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = '/logo.png';
      }}
    />
  );

  return (
    <section className="pt-16 px-4 w-full min-h-[15vh] flex items-center">
      <div className="container mx-auto px-4">
        <h2 className="text-[#08651E] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold font-montserrat leading-tight tracking-widest mb-12 text-center">CATÉGORIES</h2>
        <div className="w-full">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {categories.map((category) => (
              <div key={category.id} className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 relative p-1 sm:p-2 md:p-3">
                <Link href="/produits" className="cursor-pointer">
                  <div className="w-full h-80% absolute rounded-2xl border-2 border-[#10F24C] flex flex-col items-center justify-center p-1 sm:p-2 md:p-3 bg-white shadow-lg">
                    {renderCategoryImage(category)}
                    <div className="text-green-800 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold font-montserrat leading-tight tracking-tight text-center truncate">{category.name}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

CategorySection.displayName = 'CategorySection';

export default CategorySection;