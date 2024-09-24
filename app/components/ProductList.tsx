import React, { useEffect, useState } from 'react';
import ProductForm from './forms/ProductForm';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategorie: string;
  price: number;
  stock: number;
  agripreneurId: number;
  agripreneurName: string;
  farmName: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Échec de la récupération des produits');
        }
        const data = await response.json();

        const productsWithAgripreneurInfo = await Promise.all(
          data.map(async (product: Product) => {
            const agripreneurResponse = await fetch(`/api/agripreuneur/${product.agripreneurId}`);
            if (!agripreneurResponse.ok) {
              throw new Error('Échec de la récupération des informations de l\'agripreneur');
            }
            const agripreneurData = await agripreneurResponse.json();

            const userResponse = await fetch(`/api/users/${agripreneurData.userId}`);
            if (!userResponse.ok) {
              throw new Error('Échec de la récupération des informations de l\'utilisateur');
            }
            const userData = await userResponse.json();

            return {
              ...product,
              farmName: agripreneurData.farmName,
              agripreneurName: `${userData.firstName} ${userData.lastName}`,
            };
          })
        );

        setProducts(productsWithAgripreneurInfo);
      } catch (error) {
        setError("Une erreur s'est produite lors de la récupération des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Chargement des produits...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Liste des produits</h2>
      <button 
        onClick={() => setShowForm(true)} 
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
      >
        Ajouter un produit
      </button>
       
      {showForm && <ProductForm />}
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Nom</th>
            <th scope="col" className="px-6 py-3">description</th>
            <th scope="col" className="px-6 py-3">categorie</th>
            <th scope="col" className="px-6 py-3">Prix</th>
            <th scope="col" className="px-6 py-3">Stock</th>
            <th scope="col" className="px-6 py-3">Agripreneur</th>
            <th scope="col" className="px-6 py-3"> ferme</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">{product.description}</td>
              <td className="px-6 py-4">{product.category} : {product.subcategorie}</td>
              <td className="px-6 py-4">{product.price} €</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">{product.agripreneurName}</td>
              <td className="px-6 py-4">{product.farmName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
