import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaSearch, FaUserCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AgripreneurForm from './forms/agripreupeurform';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

interface images {
  id: string;
  imageUrl: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: images[];
}

interface Agripreneur {
  id: string;
  userId: string;
  farmName: string;
  description?: string;
  averageRating?: number;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  products?: Product[];
}

const ListAgripreneur: React.FC = () => {
  const [agripreneurs, setAgripreneurs] = useState<Agripreneur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingAgripreneur, setEditingAgripreneur] = useState<Agripreneur | null>(null);
  const [showAgripreneurForm, setShowAgripreneurForm] = useState<boolean>(false);
  const [expandedAgripreneur, setExpandedAgripreneur] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgripreneurs = async () => {
      try {
        const response = await fetch('/api/agripreuneur');
        if (!response.ok) {
          throw new Error('Échec de la récupération des agripreneurs');
        }
        const data = await response.json();
        setAgripreneurs(data);
      } catch (error) {
        setError("Une erreur s'est produite lors de la récupération des agripreneurs");
        toast.error("Une erreur s'est produite lors de la récupération des agripreneurs");
      } finally {
        setLoading(false);
      }
    };

    fetchAgripreneurs();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (agripreneur: Agripreneur) => {
    setEditingAgripreneur(agripreneur);
  };

  const handleSave = async () => {
    if (editingAgripreneur) {
      try {
        const response = await fetch(`/api/agripreuneur/${editingAgripreneur.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingAgripreneur),
        });

        if (response.ok) {
          const updatedAgripreneur = await response.json();
          setAgripreneurs(agripreneurs.map(agripreneur => (agripreneur.id === updatedAgripreneur.id ? updatedAgripreneur : agripreneur)));
          setEditingAgripreneur(null);
          toast.success("Agripreneur mis à jour avec succès");
        } else {
          console.error('Erreur lors de la mise à jour de l\'agripreneur');
          toast.error("Erreur lors de la mise à jour de l'agripreneur");
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'agripreneur:', error);
        toast.error("Erreur lors de la mise à jour de l'agripreneur");
      }
    }
  };

  const toggleAccordion = (agripreneurId: string) => {
    setExpandedAgripreneur(expandedAgripreneur === agripreneurId ? null : agripreneurId);
  };

  const filteredAgripreneurs = agripreneurs.filter(agripreneur =>
    (agripreneur.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agripreneur.description?.toLowerCase().includes(searchTerm.toLowerCase())) 
  );

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
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Liste des agripreneurs</h2>
        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Rechercher des agripreneurs..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowAgripreneurForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Ajouter Agripreneur
          </button>
        </div>
        
        {showAgripreneurForm && (
          <div className="mb-6 bg-white shadow-md rounded-lg p-6">
            <AgripreneurForm />
            <button
              onClick={() => setShowAgripreneurForm(false)}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agripreneur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ferme</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte Bancaire</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgripreneurs.map((agripreneur) => (
                <React.Fragment key={agripreneur.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleAccordion(agripreneur.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {agripreneur.user.imageUrl ? (
                            <img src={agripreneur.user.imageUrl} alt={`${agripreneur.user.firstName} ${agripreneur.user.lastName}`} className="h-10 w-10 rounded-full" />
                          ) : (
                            <FaUserCircle className="h-10 w-10 text-gray-300" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agripreneur.user.firstName} {agripreneur.user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agripreneur.farmName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agripreneur.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {agripreneur.averageRating}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agripreneur.accountName} - {agripreneur.accountNumber} ({agripreneur.bankName})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={(e) => { e.stopPropagation(); handleEditClick(agripreneur); }} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <FaEdit className="inline-block mr-1" /> Modifier
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); }} className="text-red-600 hover:text-red-900">
                        <FaTrashAlt className="inline-block mr-1" /> Supprimer
                      </button>
                      {expandedAgripreneur === agripreneur.id ? <FaChevronUp className="inline-block ml-2" /> : <FaChevronDown className="inline-block ml-2" />}
                    </td>
                  </tr>
                  {expandedAgripreneur === agripreneur.id && (
                    <tr>
                      <td colSpan={6}>
                        <div className="px-6 py-4 bg-gray-50">
                          <h4 className="text-lg font-semibold mb-2">Produits</h4>
                          {agripreneur.products && agripreneur.products.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {agripreneur.products.map((product) => (
                                  <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0].imageUrl} alt={product.images[0].imageUrl} className="h-10 w-10 rounded-full" />
                                      ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                          <span className="text-gray-500">Pas d'image</span>
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} Fcfa</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-sm text-gray-500">Aucun produit disponible pour cet agripreneur.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingAgripreneur && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Modifier l'agripreneur</h3>
              <div className="mt-2 px-7 py-3">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="farmName">
                    Nom de la Ferme
                  </label>
                  <input
                    type="text"
                    id="farmName"
                    value={editingAgripreneur.farmName}
                    onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, farmName: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={editingAgripreneur.description}
                    onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, description: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountName">
                    Nom du Compte
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    value={editingAgripreneur.accountName}
                    onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, accountName: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountNumber">
                    Numéro du Compte
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={editingAgripreneur.accountNumber}
                    onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, accountNumber: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankName">
                    Banque
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    value={editingAgripreneur.bankName}
                    onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, bankName: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditingAgripreneur(null)}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
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

export default ListAgripreneur;