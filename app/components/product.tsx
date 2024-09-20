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

export const ProductListing: React.FC<{ products: Product[] }> = ({ products }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 15;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="relative w-full mx-auto h-auto bg-[#CDEED6] p-8 rounded-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#10F24C] font-bold text-sm font-medium text-white hover:bg-[#10F24C] disabled:opacity-50"
            >
              Précédent
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-[#10F24C] text-sm font-medium ${
                  currentPage === index + 1 ? 'bg-[#08651E] text-white font-bold' : 'font-bold text-white'
                } hover:bg-[#10F24C]`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#10F24C] font-bold text-sm font-medium text-white hover:bg-[#10F24C] disabled:opacity-50"
            >
              Suivant
            </button>
          </nav>
        </div>
      )}
    {typeof window !== 'undefined' && !window.location.pathname.includes('/produits') && (
      <div className="flex justify-center mt-10">
        <a href="/produits" className="hover:bg-green-100 text-[#08651E] font-Montserrat font-extrabold py-3 px-6 rounded-3xl border-2 border-[#10F24C] text-2xl inline-block">
          Voir plus
        </a>
      </div>
    )}
  </div>
);}