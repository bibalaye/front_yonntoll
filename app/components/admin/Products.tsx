import React from 'react';
import { List, Datagrid, TextField, NumberField, ImageField, ReferenceField, EditButton, DeleteButton, Filter, TextInput, FilterProps, ListProps, Create, SimpleForm, Edit, ImageInput, required, NumberInput, ReferenceInput, SelectInput, Show, TabbedShowLayout, Tab, ArrayField, SingleFieldList, FileInput, FileField } from 'react-admin';

const ProductFilter = (props: React.JSX.IntrinsicAttributes & FilterProps) => (
  <Filter {...props}>
    <TextInput label="Rechercher" source="q" alwaysOn />
    <TextInput label="Nom" source="name" />
    <TextInput label="Catégorie" source="category.name" />
    <TextInput label="Sous-catégorie" source="subCategory.name" />
    <TextInput label="Agripreneur" source="agripreneur.farmName" />
  </Filter>
);

export const ProductList = (props: React.JSX.IntrinsicAttributes & ListProps<any>) => (
  <List {...props} filters={<ProductFilter children={undefined} />}>
    <Datagrid rowClick="show">
      <ImageField source="images[0].imageUrl" label="Image" />
      <TextField source="name" label="Nom" />
      <TextField source="description" label="Description" />
      <ReferenceField source="categoryId" reference="categories" label="Catégorie">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="subCategoryId" reference="subcategories" label="Sous-catégorie">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="price" label="Prix" options={{ style: 'currency', currency: 'XOF' }} />
      <NumberField source="stock" label="Stock" />
      <ReferenceField source="agripreneurId" reference="agripreneurs" label="Agripreneur">
        <TextField source="farmName" />
      </ReferenceField>
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const ProductTitle = ({ record }: { record?: { name: string } }) => {
  return <span>Produit {record ? `"${record.name}"` : ''}</span>;
};

export const ProductCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline />
      <NumberInput source="price" validate={required()} />
      <NumberInput source="stock" validate={required()} />
      <ReferenceInput source="categoryId" reference="categories">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="subCategoryId" reference="subcategories">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="agripreneurId" reference="agripreneurs">
        <SelectInput optionText="farmName" validate={required()} />
      </ReferenceInput>
      <FileInput source="images" multiple accept={{ 'image/*': [] }} validate={required()}>
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);

export const ProductEdit = (props: any) => (
  <Edit {...props} title={<ProductTitle />}
    transform={(data) => {
      const { images, ...rest } = data;
      if (images) {
        const newImages = images.filter((img: any) => img.rawFile);
        const existingImages = images.filter((img: any) => !img.rawFile).map((img: any) => img.id);
        return {
          ...rest,
          images: newImages,
          existingImages: existingImages
        };
      }
      return rest;
    }}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline />
      <NumberInput source="price" validate={required()} />
      <NumberInput source="stock" validate={required()} />
      <ReferenceInput source="categoryId" reference="categories">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="subCategoryId" reference="subcategories">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="agripreneurId" reference="agripreneurs">
        <SelectInput optionText="farmName" />
      </ReferenceInput>
      <ArrayField source="images">
        <SingleFieldList>
          <ImageField source="imageUrl" title="Images actuelles" />
        </SingleFieldList>
      </ArrayField>
      <FileInput source="images" multiple accept={{ 'image/*': [] }}>
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Edit>
);

export const ProductShow = (props: any) => (
  <Show {...props} title={<ProductTitle />}>
    <TabbedShowLayout>
      <Tab label="Résumé">
        <TextField source="name" label="Nom" />
        <TextField source="description" label="Description" />
        <NumberField source="price" label="Prix" options={{ style: 'currency', currency: 'XOF' }} />
        <NumberField source="stock" label="Stock" />
        <ReferenceField source="categoryId" reference="categories" label="Catégorie">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="subCategoryId" reference="subcategories" label="Sous-catégorie">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="agripreneurId" reference="agripreneurs" label="Agripreneur">
          <TextField source="farmName" />
        </ReferenceField>
      </Tab>
      <Tab label="Images">
        <ArrayField source="images">
          <SingleFieldList>
            <ImageField source="imageUrl" title="title" />
          </SingleFieldList>
        </ArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
