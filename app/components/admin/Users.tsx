import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  ImageField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Filter,
  SearchInput,
  FilterProps,
  ListProps,
  EditProps,
  Pagination
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiPaper-root': {
      backgroundColor: '#CDEED6',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  },
  table: {
    '& .MuiTableCell-head': {
      backgroundColor: '#08651E',
      color: 'white',
      fontWeight: 'bold',
    },
    '& .MuiTableRow-root:nth-of-type(even)': {
      backgroundColor: '#E8F5E9',
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: '#C8E6C9',
    },
  },
  searchInput: {
    '& .MuiFilledInput-root': {
      backgroundColor: 'white',
    },
  },
  editButton: {
    backgroundColor: '#10F24C',
    color: 'white',
    '&:hover': {
      backgroundColor: '#08651E',
    },
  },
});

const UserFilter = (props: React.JSX.IntrinsicAttributes & FilterProps) => {
  const classes = useStyles();
  return (
    <Filter {...props}>
      <div className="flex space-x-4 p-4">
        <SearchInput source="q" alwaysOn placeholder="Rechercher un utilisateur..." className={`flex-grow ${classes.searchInput}`} />
        <SelectInput 
          source="userType" 
          choices={[
            { id: 'CLIENT', name: 'Client' },
            { id: 'AGRIPRENEUR', name: 'Agripreneur' },
            { id: 'ADMIN', name: 'Admin' },
            { id: 'DELIVERY', name: 'Delivery' },
          ]}
          className="w-48"
        />
      </div>
    </Filter>
  );
};

export const UserList = (props: React.JSX.IntrinsicAttributes & ListProps<any>) => {
  const classes = useStyles();
  return (
    <List 
      {...props} 
      filters={<UserFilter children={undefined} />}
      perPage={10}
      pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />}
      className={classes.root}
    >
      <Datagrid className={classes.table} rowClick="edit">
        <ImageField source="imageUrl" title="avatar" className="w-12 h-12 rounded-full" />
        <TextField source="firstName" />
        <TextField source="lastName" />
        <EmailField source="email" />
        <TextField source="phoneNumber" />
        <TextField source="userType" />
        <EditButton className={classes.editButton} />
      </Datagrid>
    </List>
  );
};

export const UserEdit = (props: React.JSX.IntrinsicAttributes & EditProps<any, Error>) => {
  const classes = useStyles();
  return (
    <Edit {...props}>
      <SimpleForm className="bg-white p-6 rounded-lg shadow-md">
        <TextInput disabled source="firstName" className="mb-4" />
        <TextInput disabled source="lastName" className="mb-4" />
        <TextInput disabled source="email" className="mb-4" />
        <TextInput disabled source="phoneNumber" className="mb-4" />
        <SelectInput 
          source="userType" 
          choices={[
            { id: 'CLIENT', name: 'Client' },
            { id: 'AGRIPRENEUR', name: 'Agripreneur' },
            { id: 'ADMIN', name: 'Admin' },
            { id: 'DELIVERY', name: 'Delivery' },
          ]}
          className="mb-4"
        />
      </SimpleForm>
    </Edit>
  );
};
