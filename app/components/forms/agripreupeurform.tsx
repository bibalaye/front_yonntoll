import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgripreneurSchema } from '@/app/lib/formValidationSchemas';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AgripreneurFormInputs {
  userId: number;
  farmName: string;
  description?: string;
}

const AgripreneurForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<AgripreneurFormInputs>({
    resolver: zodResolver(AgripreneurSchema),
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        toast.error('Erreur lors de la récupération des utilisateurs');
      });
  }, []);

  const onSubmit: SubmitHandler<AgripreneurFormInputs> = async data => {
    try {
      const response = await fetch('/api/agripreuneur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Agripreneur ajouté avec succès');
        toast.success('Agripreneur ajouté avec succès');
        // Vous pouvez ajouter ici la logique pour notifier l'utilisateur ou mettre à jour l'interface
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'ajout de l\'agripreneur:', errorData.error);
        toast.error(`Erreur lors de l'ajout de l'agripreneur: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'agripreneur:', error);
      toast.error('Erreur lors de l\'ajout de l\'agripreneur');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ToastContainer />
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">ID Utilisateur</label>
        <select
          id="userId"
          {...register('userId', { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Sélectionnez un utilisateur</option>
          {users.map((user: { id: string; firstName: string; lastName: string }) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
        {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>}
      </div>

      <div>
        <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">Nom de la Ferme</label>
        <input
          id="farmName"
          type="text"
          {...register('farmName', { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.farmName && <p className="text-red-500 text-xs mt-1">{errors.farmName.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          {...register('description')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Ajouter 
        </button>
      </div>
    </form>
  );
};

export default AgripreneurForm;
