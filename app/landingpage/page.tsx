'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';

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
    <Image src={product.image} alt={product.name} width={400} height={300} className="w-full h-64 object-cover" />
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

const ProductCarousel: React.FC<{ products: Product[] }> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  return (
    <div className="relative mx-10 h-[550px] bg-[#CDEED6] p-8 rounded-3xl">
      <div className="flex justify-center w-full h-full space-x-4  pb-4">
        {products.slice(currentIndex, currentIndex + 3).map((product, index) => (
          <div key={index} className="flex-shrink-0 w-1/3 h-auto p-2 mx-6">
            <ProductCard product={product} />
          </div>



        ))}
      </div>
      <button 
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        onClick={prevSlide}
        aria-label="Produit précédent"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
      <button 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        onClick={nextSlide}
        aria-label="Produit suivant"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
      <div className="flex justify-center mt-4">
        {products.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full mx-1 ${i === currentIndex ? 'bg-green-600' : 'bg-gray-300'}`} />
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

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
                        <div key={index} className={`${item.bg} rounded-xl overflow-hidden absolute ${index % 2 === 0 ? 'left-2' : 'right-2'} ${index < 2 ? 'top-2' : 'bottom-2'} ${index % 3 === 0 ? 'w-[47%] h-[55%]' : 'w-[47%] h-[40%]'}`}>
                          <Image src={item.src} alt={item.alt} layout="fill" objectFit="cover" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="text-green-950 text-3xl font-bold font-montserrat">{category.category}</h3>
                      <div className="mt-6 flex justify-center">
                        {categories.map((_, index) => (
                          <button 
                            key={index}
                            onClick={() => setCurrentIndex(index)} 
                            className={`mx-1 text-green-500 hover:text-green-600 transition-colors ${index === currentIndex ? 'font-bold' : ''}`}
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

const CategorySection: React.FC = () => (
  <section className="py-16 px-4 w-full min-h-[15vh] flex items-center">
    <div className="container mx-auto">
      <div className="text-[#08651E] text-4xl sm:text-4xl md:text-6xl font-semibold font-montserrat leading-tight tracking-widest mb-12 text-center">CATÉGORIES</div>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Fruits et légumes", icon: "/icons/healthy-food 1.png" },
            { title: "Viandes et Poissons", icon: "/icons/fish 1.png" },
            { title: "Laitière et Œufs", icon: "/icons/Group 57.png" },
            { title: "Céréales", icon: "/icons/wheat 1.png" }
          ].map((category, index) => (
            <div key={index} className="w-full h-56 relative p-3">
              <div className="w-full h-5/6 absolute rounded-3xl border-2 border-[#10F24C]" />
              <div className="flex flex-col items-center justify-center h-full">
                <Image className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4" src={category.icon} alt={category.title} width={96} height={96} />
                <div className="text-green-800 text-xl sm:text-2xl md:text-3xl font-semibold font-montserrat leading-tight tracking-tight text-center">{category.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const BannerSection: React.FC = () => (
  <section className="relative">
    <div className="relative mx-auto m-10 w-full h-96 bg-cover bg-center rounded-3xl" style={{ backgroundImage: "url('/baniere1.png')" }}>
      <div className="absolute inset-0 flex items-center justify-left ">
        <div className="flex flex-col">
          <div>
            <h1 className="text-[#F2BB88] text-8xl text-center animate-fade-in-left font-babylonica">Yoonu Tool</h1>
          </div>
          <div>
            <p className="text-white text-5xl font-bold">
              NOUVEAUX PRODUITS
            </p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-end ">
        <Image src="/MacBook Air (2022).png" alt="MacBook Air" width={500} height={300} className="w-2/4 h-auto animate-fade-in-right rounded-lg" />
      </div>
    </div>
    <ProductCarousel products={products} />
  </section>
);

const JoinPlatformSection: React.FC = () => (
  <section className="w-full ">
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="w-full md:w-1/2 bg-green-100">

        <Image src="/image 25.png" alt="Image d'exemple" className="w-full h-full object-cover" width={800} height={600} />
      </div>
      <div className="w-full md:w-1/2 bg-[#F7B65C] p-8">
        <div className="py-8 m-4">
          <h1 className="text-5xl w-full font-montserrat font-extrabold text-white mb-6 ">
            Rejoignez Notre Plateforme<br />pour Augmenter Vos Ventes !
          </h1>

          <p className="text-4xl text-white font-montserrat font-semibold mb-6 ">Boostez vos revenus en rejoignant notre plateforme qui connecte <span className="font-extrabold">les fermiers aux clients</span>. Vendez facilement vos produits frais, bénéficiez d&apos;un service de livraison fiable et accédez à un marché plus large.</p>
          <div className="text-center">
        </div>
          <div className="mt-8 mb-4">
            <a href="#" className="inline-block px-6 py-3 bg-[#14A536] text-white text-2xl font-montserrat font-bold rounded-3xl w-64 h-auto hover:bg-[#118F2E] transition-colors">
              Rejoignez-nous
            </a>
          </div>

        </div>
      </div>
    </div>

  </section>
);

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
