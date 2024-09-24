import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AgripreneurForm from './forms/agripreupeurform'; // Importer le formulaire

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
}

const ListAgripreneur: React.FC = () => {
  const [agripreneurs, setAgripreneurs] = useState<Agripreneur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingAgripreneur, setEditingAgripreneur] = useState<Agripreneur | null>(null); // État pour l'agripreneur en cours d'édition
  const [showAgripreneurForm, setShowAgripreneurForm] = useState<boolean>(false); // État pour afficher le formulaire

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

  const filteredAgripreneurs = agripreneurs.filter(agripreneur =>
    (agripreneur.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agripreneur.description?.toLowerCase().includes(searchTerm.toLowerCase())) 
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-2 p-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="m-2">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Liste des agripreneurs</h2>
      <div className="mb-4 flex space-x-4">
        <div className="relative w-1/2">
          <input
            type="text"
            className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Rechercher des agripreneurs..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <button
        onClick={() => setShowAgripreneurForm(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Ajouter Agripreneur
      </button>
      {showAgripreneurForm && (
        <div className="mb-4">
          <AgripreneurForm />
          <button
            onClick={() => setShowAgripreneurForm(false)}
            className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Annuler
          </button>
        </div>
      )}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nom de la Ferme</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Note Moyenne</th>
              <th scope="col" className="px-6 py-3">Nom du Compte</th>
              <th scope="col" className="px-6 py-3">Numéro du Compte</th>
              <th scope="col" className="px-6 py-3">Banque</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgripreneurs.map((agripreneur) => (
              <tr key={agripreneur.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{agripreneur.farmName}</td>
                <td className="px-6 py-4">{agripreneur.description}</td>
                <td className="px-6 py-4">{agripreneur.averageRating}</td>
                <td className="px-6 py-4">{agripreneur.accountName}</td>
                <td className="px-6 py-4">{agripreneur.accountNumber}</td>
                <td className="px-6 py-4">{agripreneur.bankName}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => handleEditClick(agripreneur)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAgripreneur && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4">Modifier l'agripreneur</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nom de la Ferme</label>
            <input
              type="text"
              value={editingAgripreneur.farmName}
              onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, farmName: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editingAgripreneur.description}
              onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, description: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nom du Compte</label>
            <input
              type="text"
              value={editingAgripreneur.accountName}
              onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, accountName: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Numéro du Compte</label>
            <input
              type="text"
              value={editingAgripreneur.accountNumber}
              onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, accountNumber: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Banque</label>
            <input
              type="text"
              value={editingAgripreneur.bankName}
              onChange={(e) => setEditingAgripreneur({ ...editingAgripreneur, bankName: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setEditingAgripreneur(null)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAgripreneur;