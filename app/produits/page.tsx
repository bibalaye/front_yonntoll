'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Baniere from '../components/baniere';
import ProductListing from '../components/ProductListing';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/loader';

interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
}

const ProductPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, selectedSubCategory, selectedPriceRange]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      const data = await response.json();
      const categoriesWithSubCategories = await Promise.all(data.map(async (category: Category) => {
        const subCategoriesResponse = await fetch(`/api/categories/${category.id}/subcategories`);
        const subCategories = await subCategoriesResponse.json();
        return { ...category, subCategories };
      }));
      setCategories(categoriesWithSubCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      toast.error("Erreur lors de la récupération des catégories");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = `/api/products?page=${currentPage}`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      if (selectedSubCategory) {
        url += `&subCategory=${selectedSubCategory}`;
      }
      if (selectedPriceRange) {
        url += `&priceRange=${selectedPriceRange}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      toast.error("Erreur lors de la récupération des produits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
    setSelectedCategory(prevCategory => prevCategory === categoryName ? '' : categoryName);
    setSelectedSubCategory('');
    setCurrentPage(1);
  };

  const handleSubCategoryClick = (subCategoryName: string) => {
    setSelectedSubCategory(prevSubCategory => prevSubCategory === subCategoryName ? '' : subCategoryName);
    setCurrentPage(1);
  };

  const handlePriceRangeClick = (priceRange: string) => {
    setSelectedPriceRange(prevPriceRange => prevPriceRange === priceRange ? '' : priceRange);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Header />
      <main className="flex-grow">
        <Baniere 
          titre=""
          sousTitre="Nos Produits"
          imageFond="/baniere1.png"
          imageAvantPlan="/image_produit.png"
        />
        <div className="w-full p-4 sm:p-8 white min-h-screen">
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="w-full lg:w-1/4 bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 lg:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#08651E] mb-4 sm:mb-6 font-montserrat">CATÉGORIES</h2>
              <div className="flex flex-wrap -mx-2">
                {categories.map((category) => (
                  <div key={category.id} className="w-full px-2 mb-4">
                    <button 
                      className={`text-left w-full font-montserrat text-sm sm:text-base ${selectedCategory === category.name ? 'text-[#08651E] font-bold' : 'text-[#08651E]'} hover:text-[#08651E] transition duration-300`}
                      onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                      <span className="inline-block w-4">{expandedCategories.includes(category.id) ? '▼' : '▶'}</span>
                      <span className="align-middle">{category.name}</span>
                    </button>
                    {expandedCategories.includes(category.id) && (
                      <div className="ml-4 mt-2">
                        {category.subCategories && category.subCategories.length > 0 ? (
                          category.subCategories.map((subCategory) => (
                            <button
                              key={subCategory.id}
                              className={`block w-full text-left font-montserrat text-sm ${selectedSubCategory === subCategory.name ? 'text-[#08651E] font-bold' : 'text-gray-600'} hover:text-[#08651E] transition duration-300 mb-1`}
                              onClick={() => handleSubCategoryClick(subCategory.name)}
                            >
                              {subCategory.name}
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Aucune sous-catégorie disponible</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-[#08651E] mt-6 mb-4 font-montserrat">PRIX</h2>
              <div className="flex flex-wrap -mx-2">
                {[
                  { label: 'Moins de 5000 F', value: 'lt5000' },
                  { label: 'Entre 5000 F et 25000 F', value: '5000-25000' },
                  { label: 'Plus de 25000 F', value: 'gt25000' }
                ].map((priceRange, index) => (
                  <div key={index} className="w-full sm:w-1/2 lg:w-full px-2 mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`priceRange-${index}`}
                        checked={selectedPriceRange === priceRange.value}
                        onChange={() => handlePriceRangeClick(priceRange.value)}
                        className="form-checkbox h-4 w-4 text-[#08651E] rounded border-[#08651E] focus:ring-[#08651E]"
                      />
                      <label
                        htmlFor={`priceRange-${index}`}
                        className={`ml-2 font-montserrat text-sm ${selectedPriceRange === priceRange.value ? 'text-[#08651E] font-semibold' : 'text-[#08651E]'} hover:text-[#08651E] cursor-pointer transition duration-300 break-words`}
                      >
                        {priceRange.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-3/4">
              {isLoading ? (
                <Loader />
              ) : (
                <ProductListing products={products} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
