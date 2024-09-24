import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  agripreneurId: number;
  image: string;
  category: string;
  farmName: string;
}

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const data = await response.json();

        const productsWithFarmName = await Promise.all(
          data.map(async (product: Product) => {
            const agripreneurResponse = await fetch(`/api/agripreuneur/${product.agripreneurId}`);
            if (!agripreneurResponse.ok) {
              throw new Error('Échec de la récupération des informations de l\'agripreneur');
            }
            const agripreneurData = await agripreneurResponse.json();
            return {
              ...product,
              farmName: agripreneurData.farmName,
            };
          })
        );

        setProducts(productsWithFarmName);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const { currentProducts: optimizedCurrentProducts, totalPages: optimizedTotalPages } = React.useMemo(() => {
    return {
      currentProducts,
      totalPages
    };
  }, [products, currentPage]);

  return (
    <div className="relative w-full mx-auto h-auto bg-[#CDEED6] p-4 sm:p-6 md:p-8 rounded-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {optimizedCurrentProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      {optimizedTotalPages > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
          <nav className="inline-flex flex-wrap justify-center rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#10F24C] font-bold text-xs sm:text-sm font-medium text-white hover:bg-[#10F24C] disabled:opacity-50"
            >
              Précédent
            </button>
            {[...Array(optimizedTotalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-3 sm:px-4 py-2 border border-[#10F24C] text-xs sm:text-sm font-medium ${
                  currentPage === index + 1 ? 'bg-[#08651E] text-white font-bold' : 'font-bold text-white'
                } hover:bg-[#10F24C]`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === optimizedTotalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#10F24C] font-bold text-xs sm:text-sm font-medium text-white hover:bg-[#10F24C] disabled:opacity-50"
            >
              Suivant
            </button>
          </nav>
        </div>
      )}
      {typeof window !== "undefined" && !window.location.pathname.includes("/produits") && (
        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
          <a href="/produits" className="hover:bg-green-100 text-[#08651E] font-Montserrat font-extrabold py-2 sm:py-3 px-4 sm:px-6 rounded-3xl border-2 border-[#10F24C] text-lg sm:text-xl md:text-2xl inline-block">
            Voir plus
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
