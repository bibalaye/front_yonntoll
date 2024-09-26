'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

// Types
interface Product {
  id: string;
  name: string;
  category: { name: string };
  images: { imageUrl: string }[];
}

interface FormattedProduct {
  src: string;
  alt: string;
  bg: string;
  height: string;
}

interface Category {
  category: string;
  items: FormattedProduct[];
}

// Hook personnalisé pour la récupération des produits
const useProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const products: Product[] = await response.json();
        
        const productsByCategory = products.reduce((acc, product) => {
          const categoryName = product.category.name.toUpperCase();
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(product);
          return acc;
        }, {} as Record<string, Product[]>);

        const formattedCategories = Object.entries(productsByCategory).map(([categoryName, categoryProducts]): Category => {
          const productImages: FormattedProduct[] = categoryProducts
            .filter(product => product.images && product.images.length > 0)
            .map(product => ({
              src: product.images[0].imageUrl,
              alt: product.name,
              bg: "bg-pink-900",
              height: "h-32"
            }))
            .slice(0, 4);

          while (productImages.length < 4) {
            productImages.push({
              src: "/Rectangle 24.png",
              alt: "Image par défaut",
              bg: "bg-red-500",
              height: "h-32"
            });
          }

          return {
            category: categoryName,
            items: productImages
          };
        });

        setCategories(formattedCategories);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        setError("Impossible de charger les produits. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { categories, isLoading, error };
};

const BanniereAccueil: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { categories, isLoading, error } = useProducts();

  useEffect(() => {
    if (categories.length === 0) return;

    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
    };

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [categories.length]);

  if (isLoading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="relative bg-[#CDEED6] text-white p-4 sm:p-6 md:p-8 rounded-lg overflow-hidden min-h-screen flex items-center bg-[url('/banierre.png')] bg-cover bg-center">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-1/2 relative z-10 mb-8 lg:mb-0 p-4 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
            LA MARKETPLACE DIGITALE
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-6 sm:mb-8 leading-snug">
            Vente et Livraison des Produits Agricoles
          </h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
            <a className="bg-[#F7B65C] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-lg sm:text-xl lg:text-2xl hover:bg-yellow-500 transition-colors duration-300 text-center w-full sm:w-auto shadow-lg">
              Rejoignez-nous
            </a>
            <a className="border-2 border-[#F7B65C] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-lg sm:text-xl lg:text-2xl hover:bg-[#F7B65C] hover:text-white transition-colors duration-300 text-center w-full sm:w-auto shadow-lg">
              Voir nos produits
            </a>
          </div>
        </div>
        <div className="w-full lg:w-2/5 h-full">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg h-[60vh] sm:h-[70vh] md:h-[80vh]">
            <div className="relative overflow-hidden h-full">
              <div className="flex transition-transform duration-300 ease-in-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {categories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="w-full flex-shrink-0 h-full flex flex-col">
                    <div className="relative flex-grow p-2 sm:p-4">
                      {category.items.map((item, index) => (
                        <div key={index} className={`${item.bg} rounded-xl overflow-hidden absolute ${index % 2 === 0 ? 'left-1 sm:left-2' : 'right-1 sm:right-2'} ${index < 2 ? 'top-1 sm:top-2' : 'bottom-1 sm:bottom-2'} ${index % 3 === 0 ? 'w-[45%] h-[50%] sm:w-[47%] sm:h-[55%]' : 'w-[45%] h-[35%] sm:w-[47%] sm:h-[40%]'}`}>
                          <Image src={item.src} alt={item.alt} layout="fill" objectFit="cover" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 sm:mt-6 text-center">
                      <h3 className="text-green-950 text-xl sm:text-2xl md:text-3xl font-bold font-montserrat">{category.category}</h3>
                      <div className="mt-4 sm:mt-6 flex justify-center">
                        {categories.map((_, index) => (
                          <button 
                            key={index}
                            onClick={() => setCurrentIndex(index)} 
                            className={`mx-0.5 sm:mx-1 text-green-500 hover:text-green-600 transition-colors ${index === currentIndex ? 'font-bold' : ''}`}
                          >
                            .
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanniereAccueil;