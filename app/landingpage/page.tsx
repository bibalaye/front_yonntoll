'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';

const products = [
    { name: 'Betterave', price: 1500, oldPrice: 2000, rating: 4.8, farm: 'Agrobase', image: '/image 18.png' },
    { name: 'Chou rouge', price: 2000, oldPrice: 2000, rating: 4.0, farm: 'Agrobase', image: '/image 18.png'},
    { name: 'Courge', price: 1000, oldPrice: 2000, rating: 4.0, farm: 'Diamba', image: '/image 18.png' },
    { name: 'Pomme', price: 1200, oldPrice: 1500, rating: 4.5, farm: 'Agrobase', image: '/image 18.png' },
    { name: 'Laitue', price: 800, oldPrice: 1000, rating: 4.2, farm: 'Diamba', image: '/image 18.png' },
];

interface Product {
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  farm: string;
  image: string;
}

const ProductCard: React.FC<{ product: Product }> = React.memo(({ product }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Image src={product.image} alt={product.name} width={128} height={128} className="w-full h-32 object-cover mb-4 rounded" />
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
        <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="font-bold">{product.price}f / Kg</span>
          <span className="text-sm text-gray-500 line-through ml-2">{product.oldPrice}f / Kg</span>
        </div>
        <span className="text-xs text-gray-500">Ferme: {product.farm}</span>
      </div>
      <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center">
        <ShoppingCart className="mr-2" size={18} />
        Acheter
      </button>
    </div>
));

ProductCard.displayName = 'ProductCard';

const ProductListing = () => (
  <div className="w-full p-8 white min-h-screen">
    <div className="flex space-x-6">
      <div className="w-full bg-green-50 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const BanniereAccueil = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const categories = [
    {
      category: "LEGUMES",
      items: [
        { src: "/Rectangle 24.png", alt: "Betterave", bg: "bg-red-500", height: "h-32" },
        { src: "/Rectangle 24.png", alt: "Haricots Verts", bg: "bg-pink-900", height: "h-24" },
        { src: "/Rectangle 24.png", alt: "Cavolo Nero Kale", bg: "bg-pink-900", height: "h-24" },
        { src: "/Rectangle 24.png", alt: "Radis", bg: "bg-pink-900", height: "h-32" }
      ]
    },
    {
      category: "FRUITS",
      items: [
        { src: "/Rectangle 25.png", alt: "Pomme", bg: "bg-red-400", height: "h-32" },
        { src: "/Rectangle 25.png", alt: "Banane", bg: "bg-yellow-400", height: "h-25" },
        { src: "/Rectangle 25.png", alt: "Orange", bg: "bg-orange-400", height: "h-25" },
        { src: "/Rectangle 25.png", alt: "Fraise", bg: "bg-red-600", height: "h-32" }
      ]
    },
    {
      category: "LAITIERE",
      items: [
        { src: "/image 18.png", alt: "Pomme", bg: "bg-red-400", height: "h-32" },
        { src: "/image 18.png", alt: "Banane", bg: "bg-yellow-400", height: "h-25" },
        { src: "/image 18.png", alt: "Orange", bg: "bg-orange-400", height: "h-25" },
        { src: "/image 18.png", alt: "Fraise", bg: "bg-red-600", height: "h-32" }
      ]
    },
    // Ajoutez d'autres catégories ici
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-[#CDEED6] text-white p-8 rounded-lg overflow-hidden h-screen flex items-center bg-[url('/banierre.png')] bg-cover bg-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-2/3 relative z-10">
          <h1 className="text-5xl font-extrabold mb-4">LA MARKETPLACE DIGITALE</h1>

          <h2 className="text-4xl mb-8">Vente et Livraison des Produits Agricoles</h2>
          <div className="flex space-x-6">
            <a className="bg-[#F7B65C] text-white px-8 py-4 rounded-full font-semibold text-xl hover:bg-yellow-300 transition-colors">
              Rejoignez-nous
            </a>
            <a className="border-2 border-[#F7B65C] px-6 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-green-800 transition-colors">
              Voir nos produits
            </a>
          </div>
        </div>
        <div className="w-2/5 h-full">
          <div className="bg-white rounded-2xl p-6 shadow-lg h-[80vh]">
            <div className="relative overflow-hidden h-full">
              <div className="flex transition-transform duration-300 ease-in-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {categories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="w-full flex-shrink-0 h-full flex flex-col">
                    <div className="relative flex-grow p-4">
                      {category.items.map((item, index) => (
                        <div key={index} className={`${item.bg}  rounded-xl overflow-hidden absolute ${index % 2 === 0 ? 'left-2' : 'right-2'} ${index < 2 ? 'top-2' : 'bottom-2'} ${index % 3 === 0 ? 'w-[47%] h-[55%]' : 'w-[47%] h-[40%]'}`}>
                          <Image src={item.src} alt={item.alt} layout="fill" objectFit="cover" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="text-green-950 text-3xl font-bold font-montserrat">{category.category}</h3>
                      <div className="mt-6 flex justify-center">
                        <button onClick={prevSlide} className="mx-1 text-green-500 hover:text-green-600 transition-colors">.</button>
                        <button onClick={prevSlide} className="mx-1 text-green-500 hover:text-green-600 transition-colors">.</button>
                        <button onClick={prevSlide} className="mx-1 text-green-500 hover:text-green-600 transition-colors">.</button>
                        <button onClick={prevSlide} className="mx-1 text-green-500 hover:text-green-600 transition-colors">.</button>
                        <button onClick={nextSlide} className="mx-1 text-green-500 hover:text-green-600 transition-colors">.</button>
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

const CategorySection = () => (
  <section className="py-16 px-4 w-full min-h-[15vh] flex items-center">
    <div className="container mx-auto">
      <div className="text-[#08651E] text-4xl sm:text-4xl md:text-6xl font-semibold font-montserrat leading-tight tracking-widest mb-12 text-center">CATÉGORIES</div>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Fruits et légumes", icon: "icons/healthy-food 1.png" },
            { title: "Viandes et Poissons", icon: "icons/fish 1.png" },
            { title: "Laitière et Œufs", icon: "icons/Group 57.png" },
            { title: "Céréales", icon: "icons/wheat 1.png" }
          ].map((category, index) => (
            <div key={index} className="w-full h-56 relative p-3">
              <div className="w-full h-5/6 absolute rounded-3xl border-2 border-[#10F24C]" />
              <div className="flex flex-col items-center justify-center h-full">
                <img className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4" src={category.icon} alt={category.title} />
                <div className="text-green-800 text-xl sm:text-2xl md:text-3xl font-semibold font-montserrat leading-tight tracking-tight text-center">{category.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const BannerSection = () => (
  <section className="relative">
    <div className="relative mx-auto m-10 w-full h-96 bg-cover bg-center rounded-3xl" style={{ backgroundImage: "url('/baniere1.png')" }}>
      <div className="absolute inset-0 flex items-center justify-left ">
        <div className="flex flex-col">
          <div>
            <h1 className="text-[#F2BB88] text-8xl  text-center animate-fade-in-left font-babylonica">Yoonu Tool</h1>
          </div>
          <div>
            <p className="text-white text-5xl font-bold">
              NOUVEAUX PRODUITS
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-end ">
        <img src="/MacBook Air (2022).png" alt="" className="w-2/4 h-auto animate-fade-in-right rounded-lg" />
      </div>
    </div>
    <ProductListing/>
  </section>
);

const JoinPlatformSection = () => (
  <section className="w-full">
    <div className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-1/2 bg-green-100">
        <img src="/image 25.png" alt="Image d&apos;exemple" className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-1/2 bg-[#F7B65C] p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Rejoignez Notre Plateforme pour Augmenter Vos Ventes !</h3>
        <p className="text-white mb-4">Boostez vos revenus en rejoignant notre plateforme qui connecte les fermiers aux clients. Vendez facilement vos produits frais, bénéficiez d&apos;un service de livraison fiable et accédez à un marché plus large.</p>
        <a href='' className="inline-block px-4 py-2 bg-[#14A536] text-white rounded-lg hover:bg-[#118F2E] transition-colors">
          Rejoignez-nous
        </a>
      </div>
    </div>
  </section>
);

const ProductSection = ({ title }: { title: string }) => (
  <section className="py-8 px-4 w-full min-h-[15vh] flex items-center">
    <div className="container mx-auto">
      <div className="text-green-800 text-4xl sm:text-5xl md:text-6xl font-semibold font-montserrat leading-tight tracking-widest mb-12 text-center">{title}</div>
      <ProductListing/>
    </div>
  </section>
);

export default function LandingPage() {
  return (
    <div className="w-full">
      <BanniereAccueil />
      <CategorySection />
      <BannerSection />
      <ProductSection title="LES PLUS DEMANDÉS" />
      <JoinPlatformSection />
      <ProductSection title="NOS PRODUITS" />
    </div>
  );
}
