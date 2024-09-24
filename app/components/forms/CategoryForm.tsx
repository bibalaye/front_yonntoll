import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategorySchema } from '@/app/lib/formValidationSchemas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CategoryFormInputs {
  name: string;
  imageUrl?: FileList; // Change ici pour accepter un fichier
}

const CategoryForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormInputs>({
    resolver: zodResolver(CategorySchema),
  });

  const onSubmit: SubmitHandler<CategoryFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);

      // Ajout de l'image si elle est sélectionnée
      if (data.imageUrl && data.imageUrl[0]) {
        formData.append('image', data.imageUrl[0]);
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formData, // Utilisation de FormData pour envoyer des fichiers
      });

      if (response.ok) {
        toast.success('Catégorie ajoutée avec succès');
      } else {
        const errorData = await response.json();
        toast.error(`Erreur lors de l'ajout de la catégorie: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      toast.error('Erreur lors de l\'ajout de la catégorie');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ToastContainer />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom de la Catégorie
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image de la Catégorie
        </label>
        <input
          id="imageUrl"
          type="file"
          {...register('imageUrl')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
