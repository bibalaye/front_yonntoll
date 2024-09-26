import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema } from '@/app/lib/formValidationSchemas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import { ClipLoader } from 'react-spinners';

interface ProductFormInputs {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  subcategoryId: number;
  agripreneurId: number;
  stock: number;
}

interface ProductFormProps {
  onProductAdded: () => Promise<void>;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded }) => {
  const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm<ProductFormInputs>({
    resolver: zodResolver(ProductSchema),
  });

  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useSWR('/api/categories', fetcher);
  const { data: agripreneurs, error: agripreneursError, isLoading: agripreneursLoading } = useSWR('/api/agripreuneur', fetcher);

  const selectedCategoryId = watch('categoryId');
  const { data: subcategories, error: subcategoriesError, isLoading: subcategoriesLoading } = useSWR(
    selectedCategoryId ? `/api/categories/${selectedCategoryId}/subcategories` : null,
    fetcher
  );

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState<number | null>(null);

  React.useEffect(() => {
    if (categoriesError) toast.error('Erreur lors de la récupération des catégories');
    if (agripreneursError) toast.error('Erreur lors de la récupération des agripreneurs');
    if (subcategoriesError) toast.error('Erreur lors de la récupération des sous-catégories');
  }, [categoriesError, agripreneursError, subcategoriesError]);

  const onSubmit: SubmitHandler<ProductFormInputs> = async data => {
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setProductId(result.id);
        toast.success('Produit ajouté avec succès');
        setStep(2);
        reset();
      } else {
        const errorData = await response.json();
        toast.error(`Erreur lors de l'ajout du produit: ${errorData.error}`);
      }
    } catch (error) {
      toast.error('Erreur réseau lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!productId) {
      toast.error('Erreur: ID du produit non disponible');
      return;
    }

    const files = event.target.files;
    if (!files) return;

    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    formData.append('productId', productId.toString());

    try {
      const response = await fetch('/api/products/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Images ajoutées avec succès');
        setStep(1);
        setProductId(null);
      } else {
        const errorData = await response.json();
        toast.error(`Erreur lors de l'ajout des images: ${errorData.error}`);
      }
    } catch (error) {
      toast.error('Erreur réseau lors de l\'ajout des images');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div>
        <h2>Ajouter des images pour le produit</h2>
        <input type="file" multiple onChange={handleImageUpload} />
        {loading && <ClipLoader size={20} color="#4F46E5" />}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ToastContainer />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du Produit</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: "Ce champ est obligatoire" })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
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
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { 
            required: "Le prix est requis", 
            valueAsNumber: true,
            validate: value => value >= 0 || "Le prix doit être positif!"
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Catégorie</label>
        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={categoriesLoading}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories?.map((category: { id: number; name: string }) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoriesLoading && (
                <ClipLoader size={20} color="#4F46E5" className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
          )}
        />
        {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
      </div>

      <div>
        <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700">Sous-catégorie</label>
        <Controller
          name="subcategoryId"
          control={control}
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={!selectedCategoryId || subcategoriesLoading}
              >
                <option value="">Sélectionnez une sous-catégorie</option>
          
                {subcategories?.length ? subcategories.map((subcategory: { id: number; name: string }) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
                      )) : <option disabled>Aucune sous-catégorie disponible</option>}

              </select>
              {subcategoriesLoading && (
                <ClipLoader size={20} color="#4F46E5" className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
          )}
        />
        {errors.subcategoryId && <p className="text-red-500 text-xs mt-1">{errors.subcategoryId.message}</p>}
        {selectedCategoryId && !subcategoriesLoading && (!subcategories || subcategories.length === 0) && (
          <p className="text-yellow-500 text-xs mt-1">Aucune sous-catégorie disponible pour cette catégorie</p>
        )}
      </div>

      <div>
        <label htmlFor="agripreneurId" className="block text-sm font-medium text-gray-700">Agripreneur</label>
        <Controller
          name="agripreneurId"
          control={control}
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={agripreneursLoading}
              >
                <option value="">Sélectionnez un agripreneur</option>
                {agripreneurs?.map((agripreneur: { id: number; farmName: string }) => (
                  <option key={agripreneur.id} value={agripreneur.id}>
                    {agripreneur.farmName}
                  </option>
                ))}
              </select>
              {agripreneursLoading && (
                <ClipLoader size={20} color="#4F46E5" className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
          )}
        />
        {errors.agripreneurId && <p className="text-red-500 text-xs mt-1">{errors.agripreneurId.message}</p>}
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          id="stock"
          type="number"
          {...register('stock', { 
            required: "Le stock est requis", 
            valueAsNumber: true,
            validate: value => value >= 0 || "Le stock doit être positif!"
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
      </div>

      <div>
        <button 
          type="submit" 
          disabled={loading || categoriesLoading || subcategoriesLoading || agripreneursLoading} 
          className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? (
            <>
              <ClipLoader size={20} color="#ffffff" className="mr-2" />
              Ajout en cours...
            </>
          ) : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
