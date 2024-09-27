import React from 'react';
import ProductListing from './ProductListing';

const ProductSection: React.FC<{ title: string }> = ({ title }) => (
  <section className={`py-16 px-4 sm:px-6 md:px-8 lg:px-12 w-full min-h-[15vh] mx-auto ${title === 'NOS PRODUITS' ? 'pt-4' : ''}`}>
    <div className="text-green-800 text-4xl px-2 sm:text-5xl md:text-6xl font-semibold font-montserrat leading-tight tracking-widest mb-12 text-center">{title}</div>
    <ProductListing  />
  </section>
);

export default ProductSection;