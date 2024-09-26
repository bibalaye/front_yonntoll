import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductForm from './forms/ProductForm';

interface ProductImage {
  id: number;
  imageUrl: string;
}

interface Product {
  images: ProductImage[];
  id: string;
  name: string;
  description: string;
  category: { name: string } | null;
  subCategory: { name: string } | null;
  price: number;
  stock: number;
  agripreneur: {
    id: number;
    firstName: string;
    lastName: string;
    farmName: string;
  };
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Échec de la récupération des produits');
      }
      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      setError("Une erreur s'est produite lors de la récupération des produits");
      toast.error("Une erreur s'est produite lors de la récupération des produits", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setEditingProduct(product);
  }, []);

  const handleCloseProductDetails = useCallback(() => {
    setSelectedProduct(null);
    setEditingProduct(null);
  }, []);

  const handleQuickEdit = useCallback(async (field: string, value: string | number) => {
    if (selectedProduct) {
      setIsProcessing(true);
      try {
        const updatedProduct = { ...selectedProduct, [field]: typeof value === 'number' ? value : isNaN(Number(value)) ? value : Number(value) };
        const response = await fetch(`/api/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          const updatedProductData = await response.json();
          setProducts(products => products.map(p => p.id === updatedProductData.id ? updatedProductData : p));
          setSelectedProduct(updatedProductData);
          setEditingProduct(updatedProductData);
          toast.success(`${field} mis à jour avec succès`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          throw new Error('Échec de la mise à jour du produit');
        }
      } catch (error) {
        toast.error(`Erreur lors de la mise à jour du ${field}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  }, [selectedProduct]);

  const handleSaveEdit = useCallback(async () => {
    if (editingProduct) {
      setIsProcessing(true);
      try {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        });

        if (response.ok) {
          const updatedProductData = await response.json();
          setProducts(products => products.map(p => p.id === updatedProductData.id ? updatedProductData : p));
          setSelectedProduct(updatedProductData);
          setEditingProduct(null);
          toast.success('Produit mis à jour avec succès', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          throw new Error('Échec de la mise à jour du produit');
        }
      } catch (error) {
        toast.error('Erreur lors de la mise à jour du produit', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  }, [editingProduct]);

  const handleDeleteClick = useCallback((product: Product) => {
    setDeletingProduct(product);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deletingProduct) {
      setIsProcessing(true);
      try {
        const response = await fetch(`/api/products/${deletingProduct.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts(products => products.filter(p => p.id !== deletingProduct.id));
          setDeletingProduct(null);
          toast.success('Produit supprimé avec succès', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          throw new Error('Échec de la suppression du produit');
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression du produit', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  }, [deletingProduct]);

  const cancelDelete = useCallback(() => {
    setDeletingProduct(null);
  }, []);

  const filteredProducts = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return products.filter(product =>
      (product.name?.toLowerCase().includes(searchTermLower) ?? false) ||
      (product.description?.toLowerCase().includes(searchTermLower) ?? false) ||
      (product.category?.name?.toLowerCase().includes(searchTermLower) ?? false) ||
      (product.subCategory?.name?.toLowerCase().includes(searchTermLower) ?? false) ||
      (product.agripreneur?.farmName?.toLowerCase().includes(searchTermLower) ?? false)
    );
  }, [products, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-2 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r shadow-md" role="alert">
        <p className="font-bold">Erreur</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Liste des produits</h2>
        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
          >
            <FaPlus className="mr-2" /> Ajouter un produit
          </button>
        </div>
        
        {showForm && (
          <div className="mb-6 bg-white shadow-md rounded-lg p-6">
            <ProductForm onProductAdded={fetchProducts} />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Annuler
            </button>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agripreneur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleProductClick(product)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-400">Aucune image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{product.description || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{product.subCategory?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price !== undefined ? `${product.price} FCFA` : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock !== undefined ? product.stock : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.agripreneur ? `${product.agripreneur.firstName || ''} ${product.agripreneur.lastName || ''}`.trim() || 'N/A' : 'N/A'}</div>
                    <div className="text-sm text-gray-500">{product.agripreneur?.farmName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(product); }} className="text-red-600 hover:text-red-900">
                      <FaTrashAlt className="inline-block mr-1" /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(selectedProduct || editingProduct) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={(e) => e.target === e.currentTarget && handleCloseProductDetails()}>
          <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3">
              <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4">Détails du produit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct?.images?.[0]?.imageUrl || 'placeholder-image-url'}
                    alt={selectedProduct?.name || 'Product'}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
                    <input
                      type="text"
                      value={editingProduct?.name || ''}
                      onChange={(e) => setEditingProduct(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editingProduct?.description || ''}
                      onChange={(e) => setEditingProduct(prev => prev ? {...prev, description: e.target.value} : null)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
                      <input
                        type="number"
                        value={editingProduct?.price || ''}
                        onChange={(e) => setEditingProduct(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        value={editingProduct?.stock || ''}
                        onChange={(e) => setEditingProduct(prev => prev ? {...prev, stock: parseInt(e.target.value)} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <input
                      type="text"
                      value={editingProduct?.category?.name || 'N/A'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sous-catégorie</label>
                    <input
                      type="text"
                      value={editingProduct?.subCategory?.name || 'N/A'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agripreneur</label>
                    <input
                      type="text"
                      value={selectedProduct?.agripreneur ? `${selectedProduct.agripreneur.firstName || ''} ${selectedProduct.agripreneur.lastName || ''} - ${selectedProduct.agripreneur.farmName || ''}`.trim() : 'N/A'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  onClick={handleCloseProductDetails}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="delete-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmer la suppression</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer le produit "{deletingProduct.name}" ?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Suppression...' : 'Confirmer la suppression'}
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  disabled={isProcessing}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;