'use client';

import React, { useState, useMemo } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import Image from 'next/image';

const products = [
  { name: 'Betterave', price: 1500, oldPrice: 2000, rating: 4.8, farm: 'Agrobase', image: '/api/placeholder/150/150', category: 'Fruits et légumes', subCategory: 'Légume' },
  { name: 'Chou rouge', price: 2000, oldPrice: 2000, rating: 4.0, farm: 'Agrobase', image: '/api/placeholder/150/150', category: 'Fruits et légumes', subCategory: 'Légume' },
  { name: 'Courge', price: 1000, oldPrice: 2000, rating: 4.0, farm: 'Diamba', image: '/api/placeholder/150/150', category: 'Fruits et légumes', subCategory: 'Légume' },
  { name: 'Pomme', price: 1200, oldPrice: 1500, rating: 4.5, farm: 'Agrobase', image: '/api/placeholder/150/150', category: 'Fruits et légumes', subCategory: 'Fruits' },
  { name: 'Laitue', price: 800, oldPrice: 1000, rating: 4.2, farm: 'Diamba', image: '/api/placeholder/150/150', category: 'Fruits et légumes', subCategory: 'Salade' },
];

const categories = [
  {
    name: 'Fruits et légumes',
    subCategories: ['Légume', 'Fruits', 'Salade', 'Herbe', 'Panier de légumes', 'Panier fruits']
  },
  { name: 'Viande', subCategories: [] },
  { name: 'Poisson', subCategories: [] },
  { name: 'Lait', subCategories: [] }
];

interface Product {
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  farm: string;
  image: string;
  category: string;
  subCategory: string;
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

const ProductListing = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const filteredProducts = useMemo(() => products.filter(product => 
    (!selectedCategory || product.category === selectedCategory) &&
    (!selectedSubCategory || product.subCategory === selectedSubCategory)
  ), [selectedCategory, selectedSubCategory]);

  return (
    <div className="w-full p-8 white min-h-screen">
      <div className="flex space-x-6">
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-800 mb-4">CATÉGORIES</h2>
          <ul>
            {categories.map((category, index) => (
              <li key={index} className="mb-2">
                <button 
                  className={`text-left w-full ${selectedCategory === category.name ? 'text-green-900 font-bold' : 'text-green-700'} hover:text-green-900`}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setSelectedSubCategory('');
                  }}
                >
                  {selectedCategory === category.name ? '- ' : '+ '}{category.name}
                </button>
                {selectedCategory === category.name && category.subCategories.length > 0 && (
                  <ul className="ml-4 mt-2">
                    {category.subCategories.map((subCategory, subIndex) => (
                      <li key={subIndex} className="mb-1">
                        <button 
                          className={`text-left w-full ${selectedSubCategory === subCategory ? 'text-green-800 font-bold' : 'text-green-600'} hover:text-green-800`}
                          onClick={() => setSelectedSubCategory(subCategory)}
                        >
                          {subCategory}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4 bg-green-50 p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Produits = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <div className="bg-green-900 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="w-1/2">
            <h1 className="text-4xl font-bold mb-4">Nos Produits</h1>
          </div>
          <div className="w-1/3 relative">
            <Image
              src="/produits-agricoles.jpg"
              alt="Produits agricoles"
              width={500}
              height={300}
              className="rounded-lg shadow-lg animate-float"
            />
          </div>
        </div>
      </div>
      <ProductListing />
    </main>
    <Footer />
  </div>
);

export default Produits;
