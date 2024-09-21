'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { div } from 'framer-motion/client';

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
  <div className="max-w-sm bg-white rounded-3xl overflow-hidden shadow-md">
    <Image 
      src={product.image} 
      alt={product.name} 
      width={400} 
      height={300} 
      className="w-full h-auto aspect-[4/3] object-cover sm:h-48 md:h-56 lg:h-64 xl:h-72" 
    />
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold font-montserrat text-[#08651E]">{product.name}</h2>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#F7B65C]' : 'text-[#D9D9D9]'}`} fill="currentColor" />
          ))}
          <span className="ml-1 text-sm text-[#08651E]">({product.rating})</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xl font-extrabold text-[#08651E]">{product.price} f / Kg</span>
          <span className="ml-2 text-sm line-through text-[#D9482B]">{product.oldPrice} f / Kg</span>
        </div>
        <span className="text-sm text-[#08651E]">Ferme : {product.farm}</span>
      </div>
      <a href="#" className="w-full bg-[#08651E] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Acheter
      </a>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowWidth;
}

const ProductCarousel: React.FC<{ products: Product[] }> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = useWindowWidth();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  }, [products.length]);

  return (
    <div className="relative mx-2 sm:mx-4 md:mx-6 lg:mx-10 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] bg-[#CDEED6] p-4 sm:p-6 md:p-8 rounded-3xl">
      <div className="flex flex-col sm:flex-row justify-center items-center w-full h-full space-y-4 sm:space-y-0 sm:space-x-2 md:space-x-4 pb-4">
        {products.slice(currentIndex, currentIndex + (windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3)).map((product, index) => (
          <div key={index} className="w-full xs:w-3/4 sm:w-1/2 lg:w-1/3 h-auto p-2 mx-auto">
            <div className="transform transition-all duration-300 hover:scale-105">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
      <button 
        className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 sm:p-2 shadow-md"
        onClick={prevSlide}
        aria-label="Produit précédent"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
      </button>
      <button 
        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 sm:p-2 shadow-md"
        onClick={nextSlide}
        aria-label="Produit suivant"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
      </button>
      <div className="flex justify-center mt-4">
        {products.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mx-0.5 sm:mx-1 ${i === currentIndex ? 'bg-green-600' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
};

const ProductListing: React.FC = () => (
  <div className="relative w-full mx-auto h-auto bg-[#CDEED6] p-8 rounded-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (

            <ProductCard key={index} product={product} />
          ))}
        </div>
    
      <div className="flex justify-center mt-10">
        <a href="/produits" className="hover:bg-green-100 text-[#08651E] font-Montserrat font-extrabold py-3 px-6 rounded-3xl border-2 border-[#10F24C] text-2xl inline-block">
          Voir plus
        </a>
      </div>
  </div>
);

const BanniereAccueil: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const categories = useMemo(() => [
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
  ], []);

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

const CategorySection: React.FC = React.memo(() => (
  <section className="py-16 px-4 w-full min-h-[15vh] flex items-center">
    <div className="container mx-auto px-4">
      <div className="text-[#08651E] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold font-montserrat leading-tight tracking-widest mb-12 text-center">CATÉGORIES</div>
      <div className="w-full">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { title: "Fruits et légumes", icon: "/icons/healthy-food 1.png" },
            { title: "Viandes et Poissons", icon: "/icons/fish 1.png" },
            { title: "Laitière et Œufs", icon: "/icons/Group 57.png" },
           { title: "Céréales", icon: "/icons/wheat 1.png" }
          ].map((category, index) => (
            <div key={index} className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 relative p-1 sm:p-2 md:p-3">
              <div className="w-full h-80% absolute rounded-2xl border-2 border-[#10F24C] flex flex-col items-center justify-center p-1 sm:p-2 md:p-3 bg-white shadow-lg">
                <Image className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 mb-1 sm:mb-2 md:mb-3" src={category.icon} alt={category.title} width={88} height={88} />
                <div className="text-green-800 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold font-montserrat leading-tight tracking-tight text-center">{category.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
));
CategorySection.displayName = 'CategorySection';

const BannerSection: React.FC = React.memo(() => (
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
));
BannerSection.displayName = 'BannerSection';

const JoinPlatformSection: React.FC = React.memo(() => (
  <section className="w-full ">
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <div className="w-full  lg:w-1/2 bg-green-100">
        <Image 
          src="/image 25.png" 
          alt="Image d'exemple" 
          className="w-full h-full object-cover" 
          width={800} 
          height={1200} 
          layout="responsive"
        />
      </div>
      <div className="w-full lg:w-1/2 bg-[#F7B65C] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
        <div className="py-4 sm:py-6 md:py-8 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-montserrat font-extrabold text-white mb-4 sm:mb-6 leading-tight">
            Rejoignez Notre Plateforme pour Augmenter Vos Ventes !
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-montserrat font-semibold mb-4 sm:mb-6 leading-relaxed">
            Boostez vos revenus en rejoignant notre plateforme qui connecte <span className="font-extrabold">les fermiers aux clients</span>. Vendez facilement vos produits frais, bénéficiez d&apos;un service de livraison fiable et accédez à un marché plus large.
          </p>

          <div className="mt-4 sm:mt-6 md:mt-8">
            <a href="#" className="block w-full sm:inline-block sm:w-auto px-4 sm:px-6 py-3 bg-[#14A536] text-white text-base sm:text-lg md:text-xl font-montserrat font-bold rounded-3xl hover:bg-[#118F2E] transition-colors text-center">
              Rejoignez-nous
            </a>
          </div>
        </div>
      </div>
    </div>

  </section>
));
JoinPlatformSection.displayName = 'JoinPlatformSection';

const ProductSection: React.FC<{ title: string }> = ({ title }) => (
  <section className="py-16 px-4 sm:px-6 md:px-8 lg:px-12 w-full min-h-[15vh] mx-auto">
    <div className="text-green-800 text-4xl sm:text-5xl md:text-6xl font-semibold font-montserrat leading-tight tracking-widest mb-12 text-center">{title}</div>
    <ProductListing />
    
  </section>
);

const LandingPage: React.FC = () => {
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

export default LandingPage;
