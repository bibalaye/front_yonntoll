import React from 'react';
import { List, Datagrid, TextField, NumberField, ReferenceField, EditButton, DeleteButton, Filter, TextInput, FilterProps, ListProps, Create, SimpleForm, Edit, required, ReferenceInput, SelectInput } from 'react-admin';

const AgripreneurFilter = (props: React.JSX.IntrinsicAttributes & FilterProps) => (
  <Filter {...props}>
    <TextInput label="Rechercher" source="q" alwaysOn />
    <TextInput label="Nom de la ferme" source="farmName" />
  </Filter>
);

export const AgripreneurList = (props: React.JSX.IntrinsicAttributes & ListProps<any>) => (
  <List {...props} filters={<AgripreneurFilter children={undefined} />}>
    <Datagrid rowClick="edit">
      <ReferenceField source="userId" reference="users" label="Utilisateur">
        <TextField source="firstName" />
      </ReferenceField>
      <TextField source="farmName" label="Nom de la ferme" />
      <TextField source="description" />
      <NumberField source="averageRating" label="Note moyenne" />
      <TextField source="accountName" label="Nom du compte" />
      <TextField source="accountNumber" label="Numéro de compte" />
      <TextField source="bankName" label="Nom de la banque" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const AgripreneurCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users" label="Utilisateur">
        <SelectInput optionText={(record) => `${record.firstName} ${record.lastName}`} />
      </ReferenceInput>
      <TextInput source="farmName" label="Nom de la ferme" validate={required()} />
      <TextInput source="description" multiline />
      <TextInput source="accountName" label="Nom du compte" />
      <TextInput source="accountNumber" label="Numéro de compte" />
      <TextInput source="bankName" label="Nom de la banque" />
    </SimpleForm>
  </Create>
);

export const AgripreneurEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users" label="Utilisateur">
        <SelectInput optionText={(record) => `${record.firstName} ${record.lastName}`} />
      </ReferenceInput>
      <TextInput source="farmName" label="Nom de la ferme" validate={required()} />
      <TextInput source="description" multiline />
      <NumberField source="averageRating" label="Note moyenne" />
      <TextInput source="accountName" label="Nom du compte" />
      <TextInput source="accountNumber" label="Numéro de compte" />
      <TextInput source="bankName" label="Nom de la banque" />
    </SimpleForm>
  </Edit>
);
