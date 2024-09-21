import React from 'react';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';

export interface Product {
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  farm: string;
  image: string;
  category: string;
  subCategory: string;
}

export const ProductCard: React.FC<{ product: Product }> = React.memo(({ product }) => (
  <div className="max-w-full sm:max-w-sm bg-white rounded-3xl overflow-hidden shadow-md">
    <div className="relative w-full h-48 sm:h-64">
      <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" />
    </div>
    <div className="p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h2 className="text-xl sm:text-2xl font-semibold font-montserrat text-[#08651E] mb-1 sm:mb-0">{product.name}</h2>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? 'text-[#F7B65C]' : 'text-[#D9D9D9]'}`} fill="currentColor" />
          ))}
          <span className="ml-1 text-xs sm:text-sm text-[#08651E]">({product.rating})</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <div className="mb-1 sm:mb-0">
          <span className="text-base sm:text-lg font-bold text-[#08651E]">{product.price} f / Kg</span>
          <span className="ml-2 text-xs sm:text-sm line-through text-[#D9482B]">{product.oldPrice} f / Kg</span>
        </div>
        <span className="text-xs sm:text-sm text-[#08651E]">Ferme : {product.farm}</span>
      </div>
      <a href="#" className="w-full bg-[#08651E] hover:bg-green-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center text-sm sm:text-base">
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Acheter
      </a>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

export const ProductListing: React.FC<{ products: Product[] }> = ({ products }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 15;
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
    {typeof window !== 'undefined' && !window.location.pathname.includes('/produits') && (
      <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
        <a href="/produits" className="hover:bg-green-100 text-[#08651E] font-Montserrat font-extrabold py-2 sm:py-3 px-4 sm:px-6 rounded-3xl border-2 border-[#10F24C] text-lg sm:text-xl md:text-2xl inline-block">
          Voir plus
        </a>
      </div>
    )}
  </div>
);}