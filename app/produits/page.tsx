'use client';

import React, { useState, useMemo } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Baniere from '../components/baniere';
import { ProductListing, Product } from '../components/product';

const products: Product[] = [
  { name: 'Betterave', price: 1500, oldPrice: 2000, rating: 4.8, farm: 'Agrobase', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Légume' },
  { name: 'Chou rouge', price: 2000, oldPrice: 2000, rating: 4.0, farm: 'Agrobase', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Légume' },
  { name: 'Courge', price: 1000, oldPrice: 2000, rating: 4.0, farm: 'Diamba', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Légume' },
  { name: 'Pomme', price: 1200, oldPrice: 1500, rating: 4.5, farm: 'Agrobase', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Fruits' },
  { name: 'Laitue', price: 800, oldPrice: 1000, rating: 4.2, farm: 'Diamba', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Salade' },
  { name: 'Tomate', price: 1800, oldPrice: 2200, rating: 4.6, farm: 'Agrobase', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Légume' },
  { name: 'Carotte', price: 900, oldPrice: 1100, rating: 4.3, farm: 'Diamba', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Légume' },
  { name: 'Banane', price: 1300, oldPrice: 1600, rating: 4.7, farm: 'Agrobase', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Fruits' },
  { name: 'Épinard', price: 700, oldPrice: 900, rating: 4.1, farm: 'Diamba', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Salade' },
  { name: 'Bœuf', price: 5500, oldPrice: 6000, rating: 4.9, farm: 'Ferme du Sahel', image: '/image 18.png', category: 'Viande', subCategory: 'Bœuf' },
  { name: 'Poulet', price: 3500, oldPrice: 4000, rating: 4.4, farm: 'Volaille Express', image: '/image 18.png', category: 'Viande', subCategory: 'Volaille' },
  { name: 'Thon', price: 4500, oldPrice: 5000, rating: 4.6, farm: 'Pêcherie Maritime', image: '/image 18.png', category: 'Poisson', subCategory: 'Poisson de mer' },
  { name: 'Tilapia', price: 3000, oldPrice: 3500, rating: 4.2, farm: 'Aquaculture du Delta', image: '/image 18.png', category: 'Poisson', subCategory: "Poisson d'eau douce" },
  { name: 'Lait frais', price: 1000, oldPrice: 1200, rating: 4.7, farm: 'Laiterie du Ferlo', image: '/image 18.png', category: 'Lait', subCategory: 'Lait frais' },
  { name: 'Fromage local', price: 2500, oldPrice: 3000, rating: 4.5, farm: 'Laiterie du Ferlo', image: '/image 18.png', category: 'Lait', subCategory: 'Fromage' },
  { name: 'Panier de légumes assortis', price: 5000, oldPrice: 5500, rating: 4.8, farm: 'Agrobase', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Panier de légumes' },
  { name: 'Panier de fruits exotiques', price: 7000, oldPrice: 7500, rating: 4.9, farm: 'Diamba', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Panier fruits' },
  { name: 'Agneau', price: 15000, oldPrice: 16000, rating: 4.7, farm: 'Ferme du Sahel', image: '/image 18.png', category: 'Viande', subCategory: 'Agneau' },
  { name: 'Saumon', price: 12000, oldPrice: 13000, rating: 4.8, farm: 'Pêcherie Maritime', image: '/image 18.png', category: 'Poisson', subCategory: 'Poisson de mer' },
  { name: 'Yaourt artisanal', price: 500, oldPrice: 600, rating: 4.3, farm: 'Laiterie du Ferlo', image: '/image 18.png', category: 'Lait', subCategory: 'Yaourt' },
  { name: 'Truffe noire', price: 50000, oldPrice: 55000, rating: 5.0, farm: 'Délices Rares', image: '/image 18.png', category: 'Fruits et légumes', subCategory: 'Champignon' },
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

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      (!selectedCategory || product.category === selectedCategory) &&
      (!selectedSubCategory || product.subCategory === selectedSubCategory) &&
      (!selectedPriceRange || (
        (selectedPriceRange === 'lt5000' && product.price < 5000) ||
        (selectedPriceRange === '5000-25000' && product.price >= 5000 && product.price <= 25000) ||
        (selectedPriceRange === 'gt25000' && product.price > 25000)
      ))
    );
  }, [selectedCategory, selectedSubCategory, selectedPriceRange]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(prevCategory => prevCategory === categoryName ? '' : categoryName);
    setSelectedSubCategory('');
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategory(prevSubCategory => prevSubCategory === subCategory ? '' : subCategory);
  };

  const handlePriceRangeClick = (priceRange: string) => {
    setSelectedPriceRange(prevPriceRange => prevPriceRange === priceRange ? '' : priceRange);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Baniere 
          titre=""
          sousTitre="Nos Produits"
          imageFond="/baniere1.png"
          imageAvantPlan="/image_produit.png"
        />
        <div className="w-full p-8 white min-h-screen">
          <div className="flex space-x-6">
            <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#08651E] mb-6 font-montserrat">CATÉGORIES</h2>
              <ul className="space-y-4">
                {categories.map((category, index) => (
                  <li key={index} className="mb-4">
                    <button 
                      className={`text-left w-full font-montserrat text-lg ${selectedCategory === category.name ? 'text-[#08651E] font-bold' : 'text-[#08651E]'} hover:text-[#08651E] transition duration-300`}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      {selectedCategory === category.name ? '▼ ' : '▶ '}{category.name}
                    </button>
                    {selectedCategory === category.name && category.subCategories.length > 0 && (
                      <ul className="ml-6 mt-3 space-y-2">
                        {category.subCategories.map((subCategory, subIndex) => (
                          <li key={subIndex} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`subCategory-${subIndex}`}
                              checked={selectedSubCategory === subCategory}
                              onChange={() => handleSubCategoryClick(subCategory)}
                              className="form-checkbox h-4 w-4 text-[#08651E] rounded border-[#08651E] focus:ring-[#08651E]"
                            />
                            <label
                              htmlFor={`subCategory-${subIndex}`}
                              className={`ml-2 font-montserrat ${selectedSubCategory === subCategory ? 'text-[#08651E] font-semibold' : 'text-[#08651E]'} hover:text-[#08651E] cursor-pointer transition duration-300`}
                            >
                              {subCategory}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              
              <h2 className="text-2xl font-bold text-[#08651E] mt-8 mb-6 font-montserrat">PRIX</h2>
              <ul className="space-y-4">
                {[
                  { label: 'Moins de 5000 F', value: 'lt5000' },
                  { label: 'Entre 5000 F et 25000 F', value: '5000-25000' },
                  { label: 'Plus de 25000 F', value: 'gt25000' }
                ].map((priceRange, index) => (
                  <li key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`priceRange-${index}`}
                      checked={selectedPriceRange === priceRange.value}
                      onChange={() => handlePriceRangeClick(priceRange.value)}
                      className="form-checkbox h-4 w-4 text-[#08651E] rounded border-[#08651E] focus:ring-[#08651E]"
                    />
                    <label
                      htmlFor={`priceRange-${index}`}
                      className={`ml-2 font-montserrat ${selectedPriceRange === priceRange.value ? 'text-[#08651E] font-semibold' : 'text-[#08651E]'} hover:text-[#08651E] cursor-pointer transition duration-300`}
                    >
                      {priceRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-3/4">
              <ProductListing products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
