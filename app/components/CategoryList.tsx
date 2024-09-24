import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSubCategoriesByCategoryId } from '@/app/lib/actions';
import CategoryForm from './forms/CategoryForm';

interface Category {
  subCategories: any[];
  id: number;
  name: string;
  imageUrl?: string;
  description?: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);
  const [showSubCategoryForm, setShowSubCategoryForm] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Échec de la récupération des catégories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError("Une erreur s'est produite lors de la récupération des catégories");
        toast.error("Une erreur s'est produite lors de la récupération des catégories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleSave = async () => {
    if (editingCategory) {
      try {
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingCategory),
        });

        if (response.ok) {
          const updatedCategory = await response.json();
          setCategories(categories.map(category => (category.id === updatedCategory.id ? updatedCategory : category)));
          setEditingCategory(null);
          setShowCategoryForm(false);
          toast.success("Catégorie mise à jour avec succès");
        } else {
          console.error('Erreur lors de la mise à jour de la catégorie');
          toast.error("Erreur lors de la mise à jour de la catégorie");
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        toast.error("Erreur lors de la mise à jour de la catégorie");
      }
    }
  };

  const fetchSubCategories = useCallback(async (categoryId: number) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/subcategories`);
      if (!response.ok) {
        throw new Error('Échec de la récupération des sous-catégories');
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length === 0) {
        toast.info("Aucune sous-catégorie trouvée pour cette catégorie");
        setCategories(categories => categories.map(category => 
          category.id === categoryId ? { ...category, subCategories: [] } : category
        ));
      } else {
        setCategories(categories => categories.map(category => 
          category.id === categoryId ? { ...category, subCategories: data } : category
        ));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des sous-catégories:", error);
      if (error instanceof Error && error.message === 'Échec de la récupération des sous-catégories') {
        toast.info("Aucune sous-catégorie trouvée pour cette catégorie");
      } else {
        toast.error("Une erreur inattendue s'est produite lors de la récupération des sous-catégories");
      }
      setCategories(categories => categories.map(category => 
        category.id === categoryId ? { ...category, subCategories: [] } : category
      ));
    }
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = useCallback(async (id: number) => {
    if (accordionOpen === id) {
      setAccordionOpen(null);
    } else {
      setAccordionOpen(id);
      await fetchSubCategories(id);
    }
  }, [accordionOpen, fetchSubCategories]);

  const handleAddSubCategory = useCallback((id: number) => {
    setShowSubCategoryForm(id);
  }, []);

  const SubCategoryForm = ({ categoryId }: { categoryId: number }) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch(`/api/subcategories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, categoryId }),
        });

        if (response.ok) {
          toast.success('Sous-catégorie ajoutée avec succès');
          setName('');
          setShowSubCategoryForm(null);
          await fetchSubCategories(categoryId);
        } else {
          const errorData = await response.json();
          toast.error(`Erreur lors de l'ajout de la sous-catégorie: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la sous-catégorie:', error);
        toast.error('Une erreur est survenue lors de l\'ajout de la sous-catégorie');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la sous-catégorie"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <div className="flex space-x-2">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => setShowSubCategoryForm(null)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Annuler
          </button>
        </div>
      </form>
    );
  };

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
      <h2 className="text-2xl font-bold mb-4">Liste des catégories</h2>
      <div className="mb-4 flex space-x-4">
        <div className="relative w-1/2">
          <input
            type="text"
            className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Rechercher des catégories..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={() => setShowCategoryForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Ajouter Catégorie
        </button>
      </div>
      {showCategoryForm && (
        <div className="mb-4">
          <CategoryForm />
          <button
            onClick={() => setShowCategoryForm(false)}
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
              <th scope="col" className="px-6 py-3">Image</th>
              <th scope="col" className="px-6 py-3">Catégorie</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <React.Fragment key={category.id}>
                <tr className="bg-white border-b hover:bg-gray-50" onClick={() => toggleAccordion(category.id)}>
                  <td className="px-6 py-4">
                    {category.imageUrl && <img src={category.imageUrl} alt={category.name} className="w-16 h-16 object-cover rounded-md" />}
                  </td>
                  <td className="px-6 py-4">{category.name}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => handleEditClick(category)} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
                {accordionOpen === category.id && (
                  <tr className="bg-gray-100">
                    <td colSpan={3} className="p-4">
                      <h3 className="text-lg font-bold mb-2">Sous-catégories de {category.name}</h3>
                      <ul className="mb-4">
                        {category.subCategories && category.subCategories.length > 0 ? (
                          category.subCategories.map((subCategory) => (
                            <li key={subCategory.id} className="mb-2">
                              {subCategory.name}
                            </li>
                          ))
                        ) : (
                          <li className="mb-2">Aucune sous-catégorie disponible</li>
                        )}
                      </ul>
                      <button
                        onClick={() => handleAddSubCategory(category.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                      >
                        Ajouter Sous-catégorie
                      </button>
                      {showSubCategoryForm === category.id && (
                        <SubCategoryForm categoryId={category.id} />
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {editingCategory && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4">Modifier la catégorie</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nom de la Catégorie</label>
            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">URL de l'image</label>
            <input
              type="text"
              value={editingCategory.imageUrl}
              onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setEditingCategory(null)}
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

export default CategoryList;
