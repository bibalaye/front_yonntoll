import React from 'react';
import { List, Datagrid, TextField, ImageField, EditButton, DeleteButton, Create, Edit, SimpleForm, TextInput, ImageInput, required, ListProps, CreateProps, EditProps, FileInput } from 'react-admin';
import { useRecordContext } from 'react-admin';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryTitle = ({ record }: { record: { name: string } | undefined }) => {
    return <span>Catégorie {record ? `"${record.name}"` : ''}</span>;
};

const CategoryList = (props: React.JSX.IntrinsicAttributes & ListProps<any>) => (
    <List {...props}>
        <Datagrid>
            <ImageField source="imageUrl" title="Image" />
            <TextField source="name" />
            <EditButton />
            <DeleteButton />
            <SubCategoriesButton />
        </Datagrid>
    </List>
);

const SubCategoriesButton = () => {
    const record = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/subcategories?filter=${JSON.stringify({ categoryId: record?.id })}`}
            color="primary"
        >
            Sous-catégories
        </Button>
    );
};

const CategoryCreate = (props: React.JSX.IntrinsicAttributes & CreateProps<any, Error, any>) => (
  <Create {...props}>
      <SimpleForm>
          <TextInput source="name" validate={required()} />
          <ImageInput source="image" accept={{ 'image/*': [] }}>
              <ImageField source="src" title="title" />
          </ImageInput>
      </SimpleForm>
  </Create>
);

const CategoryEdit = (props: React.JSX.IntrinsicAttributes & EditProps<any, Error>) => (
    <Edit {...props} title={<CategoryTitle record={undefined} />}
          transform={(data) => {
              if (!data.image || !data.image.rawFile) {
                  const { image, ...rest } = data;
                  return rest;
              }
              return data;
          }}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <ImageInput source="image" accept={{ 'image/*': [] }}>
                <ImageField source="src" title="title" />
            </ImageInput>
            <ImageField source="imageUrl" title="Image actuelle" />
        </SimpleForm>
    </Edit>
);

export { CategoryList, CategoryCreate, CategoryEdit };
