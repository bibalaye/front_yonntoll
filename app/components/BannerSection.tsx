import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductCarousel from './ProductCarousel';
import { Product } from '@prisma/client';

const BannerSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="relative">
      <div className="relative mx-auto my-10 w-full h-64 sm:h-80 md:h-96 lg:h-[30rem] bg-cover bg-center rounded-3xl" style={{ backgroundImage: "url('/baniere1.png')" }}>
        <div className="absolute inset-0 flex items-center justify-start px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col items-start space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
            <div>
              <h1 className="text-[#F2BB88] text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl text-center animate-fade-in-left font-babylonica">Yoonu Tool</h1>
            </div>
            <div>
              <p className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
                NOUVEAUX PRODUITS
              </p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-end px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
          <Image src="/MacBook Air (2022).png" alt="MacBook Air" width={500} height={300} className="w-2/3 sm:w-2/3 md:w-2/3 lg:w-2/4 xl:w-3/5 h-auto animate-fade-in-right rounded-lg" loading="lazy" />
        </div>
      </div>
      <ProductCarousel products={products} />
    </section>
  );
};

BannerSection.displayName = 'BannerSection';

export default BannerSection;