import React from 'react';
import { List, Datagrid, TextField, NumberField, ReferenceField, EditButton, DeleteButton, Filter, TextInput, FilterProps, ListProps, Create, SimpleForm, Edit, required, ReferenceInput, SelectInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Grid, Avatar, Box, Chip } from '@mui/material';
import { Store, Description, Star, AccountBalance, Search, FilterList } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiPaper-root': {
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    },
  },
  table: {
    '& .MuiTableCell-head': {
      backgroundColor: '#08651E',
      color: 'white',
      fontWeight: 'bold',
    },
    '& .MuiTableRow-root:nth-of-type(even)': {
      backgroundColor: '#F8F8F8',
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: '#E8F5E9',
    },
  },
  card: {
    margin: '16px 0',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  },
  cardContent: {
    padding: '24px',
  },
  avatar: {
    backgroundColor: '#10F24C',
    color: '#08651E',
  },
  searchInput: {
    marginBottom: '16px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#08651E',
      },
      '&:hover fieldset': {
        borderColor: '#10F24C',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#10F24C',
      },
    },
  },
  chip: {
    margin: '0 8px 8px 0',
    backgroundColor: '#E8F5E9',
    color: '#08651E',
  },
  actionButton: {
    margin: '0 4px',
    '&.MuiButton-containedPrimary': {
      backgroundColor: '#08651E',
      '&:hover': {
        backgroundColor: '#10F24C',
      },
    },
  },
}));

const AgripreneurFilter = (props: React.JSX.IntrinsicAttributes & FilterProps) => {
  const classes = useStyles();
  return (
    <Filter {...props}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <FilterList />
            <Typography variant="h6" style={{ marginLeft: '8px' }}>Filtres avancés</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextInput
                label="Rechercher un agripreneur"
                source="q"
                alwaysOn
                fullWidth
                className={classes.searchInput}
                InputProps={{
                  startAdornment: <Search color="action" />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput label="Nom de la ferme" source="farmName" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectInput
                source="rating"
                label="Note minimale"
                choices={[
                  { id: '4', name: '4 étoiles et plus' },
                  { id: '3', name: '3 étoiles et plus' },
                  { id: '2', name: '2 étoiles et plus' },
                ]}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Filter>
  );
};

export const AgripreneurList = (props: React.JSX.IntrinsicAttributes & ListProps<any>) => {
  const classes = useStyles();
  return (
    <List {...props} filters={<AgripreneurFilter children={undefined} />} className={classes.root}>
      <Datagrid rowClick="edit" className={classes.table}>
        <ReferenceField source="userId" reference="users" label="Utilisateur">
          <TextField source="firstName" />
        </ReferenceField>
        <TextField source="farmName" label="Nom de la ferme" />
        <NumberField
          source="averageRating"
          label="Note moyenne"
          options={{ maximumFractionDigits: 1 }}
          textAlign="center"
        />
        <EditButton className={classes.actionButton} />
        <DeleteButton className={classes.actionButton} />
      </Datagrid>
    </List>
  );
};

export const AgripreneurCreate = (props: any) => {
  const classes = useStyles();
  return (
    <Create {...props}>
      <SimpleForm>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" gutterBottom>Informations de l'Agripreneur</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <ReferenceInput source="userId" reference="users" label="Utilisateur">
                  <SelectInput optionText={(record) => `${record.firstName} ${record.lastName}`} />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput source="farmName" label="Nom de la ferme" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextInput source="description" multiline rows={4} fullWidth />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" gutterBottom>Informations bancaires</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextInput source="accountName" label="Nom du compte" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextInput source="accountNumber" label="Numéro de compte" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextInput source="bankName" label="Nom de la banque" fullWidth />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SimpleForm>
    </Create>
  );
};

export const AgripreneurEdit = (props: any) => {
  const classes = useStyles();
  return (
    <Edit {...props}>
      <SimpleForm>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" gutterBottom>Informations de l'Agripreneur</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <ReferenceInput source="userId" reference="users" label="Utilisateur">
                  <SelectInput optionText={(record) => `${record.firstName} ${record.lastName}`} />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput source="farmName" label="Nom de la ferme" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextInput source="description" multiline rows={4} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Star style={{ color: '#FFD700', marginRight: '8px' }} />
                  <NumberField
                    source="averageRating"
                    label="Note moyenne"
                    options={{ maximumFractionDigits: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" gutterBottom>Informations bancaires</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextInput source="accountName" label="Nom du compte" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextInput source="accountNumber" label="Numéro de compte" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextInput source="bankName" label="Nom de la banque" fullWidth />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SimpleForm>
    </Edit>
  );
};
