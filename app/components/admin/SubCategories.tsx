import React from 'react';
import { List, Datagrid, TextField, ImageField, EditButton, DeleteButton, Create, Edit, SimpleForm, TextInput, ImageInput, required, ListProps, CreateProps, EditProps, FileInput, ReferenceField, SelectInput, ReferenceInput } from 'react-admin';
import { useRecordContext } from 'react-admin';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const SubCategoryTitle = ({ record }: { record: { name: string } | undefined }) => {
    return <span>Sous-catégorie {record ? `"${record.name}"` : ''}</span>;
};

const SubCategoryList = (props: React.JSX.IntrinsicAttributes & ListProps<any>) => (
    <List {...props}>
        <Datagrid>
            <TextField source="name" />
            <ReferenceField source="categoryId" reference="categories" >
                <TextField source="name" />
            </ReferenceField>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

const SubCategoryCreate = (props: React.JSX.IntrinsicAttributes & CreateProps<any, Error, any>) => (
  <Create {...props}>
      <SimpleForm>
          <TextInput source="name" validate={required()} />
          <ReferenceInput source="categoryId" reference="categories" >
            <SelectInput source="name" />
          </ReferenceInput>
      </SimpleForm>
  </Create>
);

const SubCategoryEdit = (props: React.JSX.IntrinsicAttributes & EditProps<any, Error>) => (
    <Edit {...props} title={<SubCategoryTitle record={undefined} />}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <ReferenceInput source="categoryId" reference="categories" >
                <SelectInput source="name" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export { SubCategoryList, SubCategoryCreate, SubCategoryEdit };
