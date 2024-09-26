import jsonServerProvider from 'ra-data-json-server';
import { CreateParams, UpdateParams, fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const httpClient = (url: string, options: RequestInit = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  // Vous pouvez ajouter ici la gestion de l'authentification si nécessaire
  return fetchUtils.fetchJson(url, options);
};

const baseDataProvider = jsonServerProvider('/api', httpClient);

const dataProvider = {
  ...baseDataProvider,
  create: (resource: string, params: CreateParams<any>) => {
    if (resource === 'products' && params.data.images) {
      const formData = new FormData();
      Object.keys(params.data).forEach(key => {
        if (key === 'images') {
          for (let i = 0; i < params.data.images.length; i++) {
            formData.append('images', params.data.images[i].rawFile);
          }
        } else {
          formData.append(key, params.data[key]);
        }
      });

      return httpClient(`/api/${resource}`, {
        method: 'POST',
        body: formData,
      }).then(({ json }) => ({
        data: { ...params.data, id: json.id },
      }));
    }
    // Si ce n'est pas un produit ou s'il n'y a pas d'images, utilisez le dataProvider par défaut
    return baseDataProvider.create(resource, params);
  },
  update: (resource: string, params: UpdateParams<any>) => {
    if (resource === 'products' && params.data.images) {
      const formData = new FormData();
      Object.keys(params.data).forEach(key => {
        if (key === 'images') {
          for (let i = 0; i < params.data.images.length; i++) {
            if (params.data.images[i].rawFile) {
              formData.append('images', params.data.images[i].rawFile);
            }
          }
        } else {
          formData.append(key, params.data[key]);
        }
      });

      return httpClient(`/api/${resource}/${params.id}`, {
        method: 'PUT',
        body: formData,
      }).then(({ json }) => ({
        data: json,
      }));
    } else {
      // Si ce n'est pas un produit ou s'il n'y a pas de nouvelles images, utilisez le dataProvider par défaut
      return baseDataProvider.update(resource, params);
    }
  },
};

export default dataProvider;