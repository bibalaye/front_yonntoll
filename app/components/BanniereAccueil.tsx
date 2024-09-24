'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

const BanniereAccueil: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<{ category: string; items: { src: string; alt: string; bg: string; height: string; }[]; }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }
        const data = await response.json();
        
        // Transformer les données reçues pour correspondre à la structure attendue
        const formattedCategories = data.map((category: { name: string }) => ({
          category: category.name.toUpperCase(),
          items: [
            { src: "/Rectangle 24.png", alt: "Image 1", bg: "bg-red-500", height: "h-32" },
            { src: "/Rectangle 24.png", alt: "Image 2", bg: "bg-pink-900", height: "h-24" },
            { src: "/Rectangle 24.png", alt: "Image 3", bg: "bg-pink-900", height: "h-24" },
            { src: "/Rectangle 24.png", alt: "Image 4", bg: "bg-pink-900", height: "h-32" }
          ]
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
    };

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [categories.length]);

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