import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch, FaChevronDown, FaChevronUp, FaPen, FaTimes, FaCheck } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryForm from './forms/CategoryForm';

interface Category {
  subCategories: SubCategory[];
  id: number;
  name: string;
  imageUrl?: string;
  description?: string;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
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
  const [newImage, setNewImage] = useState<File | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  const fetchCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleEditClick = useCallback((category: Category) => {
    setEditingCategory(category);
    setNewImage(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (editingCategory) {
      try {
        const formData = new FormData();
        formData.append('name', editingCategory.name);
        if (newImage) {
          formData.append('image', newImage);
        }

        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: formData,
        });

        if (response.ok) {
          const savedCategory = await response.json();
          setCategories(prevCategories => prevCategories.map(category => (category.id === savedCategory.id ? savedCategory : category)));
          setEditingCategory(null);
          setNewImage(null);
          toast.success("Catégorie mise à jour avec succès");
        } else {
          toast.error("Erreur lors de la mise à jour de la catégorie");
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        toast.error("Erreur lors de la mise à jour de la catégorie");
      }
    }
  }, [editingCategory, newImage]);

  const handleDeleteClick = useCallback((category: Category) => {
    setDeletingCategory(category);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deletingCategory) {
      try {
        const response = await fetch(`/api/categories/${deletingCategory.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setCategories(prevCategories => prevCategories.filter(category => category.id !== deletingCategory.id));
          toast.success("Catégorie supprimée avec succès");
        } else {
          const errorData = await response.json();
          toast.error(errorData.error === 'La catégorie contient des produits' 
            ? "Impossible de supprimer la catégorie car elle contient des produits"
            : "Erreur lors de la suppression de la catégorie");
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        toast.error("Erreur lors de la suppression de la catégorie");
      } finally {
        setDeletingCategory(null);
      }
    }
  }, [deletingCategory]);

  const cancelDelete = useCallback(() => {
    setDeletingCategory(null);
  }, []);

  const fetchSubCategories = useCallback(async (categoryId: number) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/subcategories`);
      if (!response.ok) {
        throw new Error('Échec de la récupération des sous-catégories');
      }
      const data = await response.json();
      setCategories(prevCategories => prevCategories.map(category => 
        category.id === categoryId ? { ...category, subCategories: data } : category
      ));
      if (Array.isArray(data) && data.length === 0) {
        toast.info("Aucune sous-catégorie trouvée pour cette catégorie");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des sous-catégories:", error);
      toast.error("Une erreur s'est produite lors de la récupération des sous-catégories");
      setCategories(prevCategories => prevCategories.map(category => 
        category.id === categoryId ? { ...category, subCategories: [] } : category
      ));
    }
  }, []);

  const filteredCategories = useMemo(() => categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [categories, searchTerm]);

  const toggleAccordion = useCallback(async (id: number) => {
    setAccordionOpen(prevId => prevId === id ? null : id);
    if (accordionOpen !== id) {
      await fetchSubCategories(id);
    }
  }, [accordionOpen, fetchSubCategories]);

  const handleAddSubCategory = useCallback((id: number) => {
    setShowSubCategoryForm(id);
  }, []);

  const handleEditSubCategory = useCallback((subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
  }, []);

  const handleSaveSubCategory = useCallback(async (subCategory: SubCategory) => {
    try {
      const response = await fetch(`/api/subcategories/${subCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subCategory),
      });

      if (response.ok) {
        toast.success('Sous-catégorie mise à jour avec succès');
        await fetchSubCategories(subCategory.categoryId);
        setEditingSubCategory(null);
      } else {
        const errorData = await response.json();
        toast.error(`Erreur lors de la mise à jour de la sous-catégorie: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la sous-catégorie:', error);
      toast.error('Une erreur est survenue lors de la mise à jour de la sous-catégorie');
    }
  }, [fetchSubCategories]);

  const handleDeleteSubCategory = useCallback(async (subCategory: SubCategory) => {
    try {
      const response = await fetch(`/api/subcategories/${subCategory.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Sous-catégorie supprimée avec succès');
        await fetchSubCategories(subCategory.categoryId);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error === 'La sous-catégorie contient des produits'
          ? "Impossible de supprimer la sous-catégorie car elle contient des produits"
          : `Erreur lors de la suppression de la sous-catégorie: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la sous-catégorie:', error);
      toast.error('Une erreur est survenue lors de la suppression de la sous-catégorie');
    }
  }, [fetchSubCategories]);

  const SubCategoryForm = useCallback(({ categoryId }: { categoryId: number }) => {
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
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la sous-catégorie"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
        <div className="flex space-x-2">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => setShowSubCategoryForm(null)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }, [fetchSubCategories]);

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
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Liste des catégories</h2>
        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Rechercher des catégories..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
          >
            <FaPlus className="mr-2" /> Ajouter Catégorie
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <React.Fragment key={category.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.imageUrl && <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded-full" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditClick(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <FaEdit className="inline-block mr-1" /> Modifier
                      </button>
                      <button onClick={() => handleDeleteClick(category)} className="text-red-600 hover:text-red-900 mr-4">
                        <FaTrashAlt className="inline-block mr-1" /> Supprimer
                      </button>
                      <button onClick={() => toggleAccordion(category.id)} className="text-gray-600 hover:text-gray-900">
                        {accordionOpen === category.id ? <FaChevronUp className="inline-block" /> : <FaChevronDown className="inline-block" />}
                      </button>
                    </td>
                  </tr>
                  {accordionOpen === category.id && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 bg-gray-50">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h3 className="text-lg font-semibold mb-4">Sous-catégories de {category.name}</h3>
                          <ul className="mb-4 space-y-2">
                            {category.subCategories && category.subCategories.length > 0 ? (
                              category.subCategories.map((subCategory) => (
                                <li key={subCategory.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                                  {editingSubCategory && editingSubCategory.id === subCategory.id ? (
                                    <input
                                      type="text"
                                      value={editingSubCategory.name}
                                      onChange={(e) => setEditingSubCategory({ ...editingSubCategory, name: e.target.value })}
                                      className="flex-grow mr-2 p-1 border border-gray-300 rounded-md"
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-700">{subCategory.name}</span>
                                  )}
                                  <div>
                                    {editingSubCategory && editingSubCategory.id === subCategory.id ? (
                                      <>
                                        <button onClick={() => handleSaveSubCategory(editingSubCategory)} className="text-green-600 hover:text-green-800 mr-2">
                                          <FaCheck className="inline-block" />
                                        </button>
                                        <button onClick={() => setEditingSubCategory(null)} className="text-gray-600 hover:text-gray-800">
                                          <FaTimes className="inline-block" />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button onClick={() => handleEditSubCategory(subCategory)} className="text-blue-600 hover:text-blue-800 mr-2">
                                          <FaPen className="inline-block" />
                                        </button>
                                        <button onClick={() => handleDeleteSubCategory(subCategory)} className="text-red-600 hover:text-red-800">
                                          <FaTrashAlt className="inline-block" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500">Aucune sous-catégorie disponible</li>
                            )}
                          </ul>
                          <button
                            onClick={() => handleAddSubCategory(category.id)}
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            aria-label="Ajouter Sous-catégorie"
                          >
                            <FaPlus />
                          </button>
                          {showSubCategoryForm === category.id && (
                            <SubCategoryForm categoryId={category.id} />
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
      {showCategoryForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="category-form-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Ajouter une catégorie</h3>
              <CategoryForm />
              <button
                onClick={() => setShowCategoryForm(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      {editingCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Modifier la catégorie</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nom de la catégorie"
                />
                <input
                  type="file"
                  onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
                  className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  accept="image/*"
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setNewImage(null);
                  }}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deletingCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="delete-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmer la suppression</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer la catégorie "{deletingCategory.name}" ?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2"
                >
                  Confirmer la suppression
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
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

export default CategoryList;
