import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AgripreneurForm from './forms/agripreupeurform'; // Importer le formulaire

interface User {
  imageUrl: string | undefined;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string; // Ajout du champ userType
}

const ListUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>(''); // État pour le filtre de type d'utilisateur
  const [editingUser, setEditingUser] = useState<User | null>(null); // État pour l'utilisateur en cours d'édition
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Échec de la récupération des utilisateurs');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError("Une erreur s'est produite lors de la récupération des utilisateurs");
        toast.error("Une erreur s'est produite lors de la récupération des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, userType: event.target.value });
    }
  };

  const handleSave = async () => {
    if (editingUser) {
      try {
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userType: editingUser.userType }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
          setEditingUser(null);
          toast.success("Utilisateur mis à jour avec succès");
        } else {
          console.error('Erreur lors de la mise à jour de l\'utilisateur');
          toast.error("Erreur lors de la mise à jour de l'utilisateur");
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        toast.error("Erreur lors de la mise à jour de l'utilisateur");
      }
    }
  };

  const filteredUsers = users.filter(user =>
    (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm)) &&
    (filterType === '' || user.userType === filterType)
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
      <h2 className="text-2xl font-bold mb-4">Liste des utilisateurs</h2>
      <div className="mb-4 flex space-x-4">
        <div className="relative w-1/2">
          <input
            type="text"
            className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Rechercher des utilisateurs..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative w-1/2">
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous les types</option>
            <option value="CLIENT">Client</option>
            <option value="AGRIPRENEUR">Agripreneur</option>
            <option value="ADMIN">Admin</option>
            <option value="DELIVERY">Delivery</option>
          </select>
        </div>
      </div>
      
      
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Image</th>
              <th scope="col" className="px-6 py-3">Nom</th>
              <th scope="col" className="px-6 py-3">Prénom</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Téléphone</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4"><img src={user.imageUrl} alt={user.firstName} className="w-10 h-10 rounded-full" /></td>
                <td className="px-6 py-4">{user.lastName}</td>
                <td className="px-6 py-4">{user.firstName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phoneNumber}</td>
                <th className="px-6 py-4">{user.userType}</th>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => handleEditClick(user)} className="text-blue-500 hover:text-blue-700">
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

      {editingUser && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4">Modifier l'utilisateur</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={editingUser.lastName}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              value={editingUser.firstName}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={editingUser.email}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              value={editingUser.phoneNumber}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
            <select
              value={editingUser.userType}
              onChange={handleUserTypeChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="CLIENT">Client</option>
              <option value="AGRIPRENEUR">Agripreneur</option>
              <option value="ADMIN">Admin</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setEditingUser(null)}
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

export default ListUser;