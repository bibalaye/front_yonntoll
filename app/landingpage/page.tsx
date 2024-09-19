'use client';

import React, { useMemo } from 'react';
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

const ProductCard = React.memo(({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-4 rounded" />
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

const BanniereAccueil = () => (
  <div className="relative bg-[#CDEED6] text-white p-8 rounded-lg overflow-hidden h-screen flex items-center bg-[url('/banierre.png')] bg-cover bg-center">
    <div className="container mx-auto flex justify-between items-center">
      <div className="w-1/2 relative z-10">
        <h1 className="text-5xl font-bold mb-4">LA MARKETPLACE DIGITALE</h1>
        <h2 className="text-2xl mb-8">Vente et Livraison des Produits Agricoles</h2>
        <div className="flex space-x-6">
          <button className="bg-yellow-400 text-green-800 px-6 py-3 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors">
            Rejoignez-nous
          </button>
          <button className="border-2 border-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-green-800 transition-colors">
            Voir nos produits
          </button>
        </div>
      </div>
      <div className="w-1/3">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="grid grid-cols-2 gap-2">
            {[
              { src: "/betterave.jpg", alt: "Betterave", bg: "bg-red-500" },
              { src: "/haricots-verts.jpg", alt: "Haricots Verts", bg: "bg-pink-900" },
              { src: "/cavolo-nero-kale.jpg", alt: "Cavolo Nero Kale", bg: "bg-pink-900" },
              { src: "/radis.jpg", alt: "Radis", bg: "bg-pink-900" }
            ].map((item, index) => (
              <div key={index} className={`${item.bg} rounded-xl overflow-hidden`}>
                <Image src={item.src} alt={item.alt} width={100} height={100} layout="responsive" />
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-green-950 text-2xl font-bold font-['Montserrat']">LEGUMES</h3>
            <div className="text-green-950/50 text-3xl font-bold font-['Montserrat']">. . . . . . . . . .</div>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-green-900 opacity-50"></div>
  </div>
);

const CategorySection = () => (
  <section className="py-8 px-4 w-full min-h-[15vh] flex items-center">
    <div className="container mx-auto">
      <div className="text-green-800 text-4xl sm:text-5xl md:text-6xl font-semibold font-['Montserrat'] leading-tight tracking-widest mb-12 text-center">CATÉGORIES</div>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Fruits et légumes", icon: "icons/healthy-food 1.png" },
            { title: "Viandes et Poissons", icon: "icons/fish 1.png" },
            { title: "Laitière et Œufs", icon: "icons/Group 57.png" },
            { title: "Céréales", icon: "icons/wheat 1.png" }
          ].map((category, index) => (
            <div key={index} className="w-full h-56 relative p-3">
              <div className="w-full h-full absolute rounded-3xl border-4 border-green-500" />
              <div className="absolute left-8 bottom-8 text-green-800 text-xl sm:text-2xl md:text-3xl font-semibold font-['Montserrat'] leading-tight tracking-tight">{category.title}</div>
              <img className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2" src={category.icon} alt={category.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const BannerSection = () => (
  <section className="relative">
    <div className="w-full h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: "url('/baniere1.png')" }}>
      <div className="absolute inset-0 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-white text-2xl font-bold ml-4">yonnu Toll</div>
          <div className="text-white text-2xl font-bold ml-4">Nouveaux produits</div>
        </div>
        <img className="w-16 h-16 mr-4" src="icons/welcome.png" alt="Bienvenue" />
      </div>
    </div>
    <ProductListing/>
  </section>
);

const JoinPlatformSection = () => (
  <section className="w-full">
    <div className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-1/2 bg-green-100">
        <img src="/image 25.png" alt="Image d'exemple" className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-1/2 bg-[#F7B65C] p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Rejoignez Notre Plateforme pour Augmenter Vos Ventes !</h3>
        <p className="text-white mb-4">Boostez vos revenus en rejoignant notre plateforme qui connecte les fermiers aux clients. Vendez facilement vos produits frais, bénéficiez d'un service de livraison fiable et accédez à un marché plus large.</p>
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
      <div className="text-green-800 text-4xl sm:text-5xl md:text-6xl font-semibold font-['Montserrat'] leading-tight tracking-widest mb-12 text-center">{title}</div>
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
