import React from 'react';
import { List, Datagrid, TextField, NumberField, ImageField, ReferenceField, EditButton, DeleteButton, Filter, TextInput, FilterProps, ListProps, Create, SimpleForm, Edit, ImageInput, required, NumberInput, ReferenceInput, SelectInput, Show, TabbedShowLayout, Tab, ArrayField, SingleFieldList, FileInput, FileField } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Grid, Chip, Box, Paper, InputAdornment } from '@mui/material';
import { Search, LocalOffer, Category, Store, Description, AttachMoney, Inventory } from '@mui/icons-material';

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
  chip: {
    margin: '0 8px 8px 0',
    backgroundColor: '#E8F5E9',
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

const ProductFilter = (props: React.JSX.IntrinsicAttributes & FilterProps) => {
  const classes = useStyles();
  return (
    <Filter {...props}>
      <Paper elevation={0} className={classes.card}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>Filtres avancés</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextInput
                label="Rechercher un produit"
                source="q"
                alwaysOn
                fullWidth
                className={classes.searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextInput label="Nom" source="name" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextInput label="Catégorie" source="category.name" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextInput label="Agripreneur" source="agripreneur.farmName" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <NumberInput label="Prix min" source="price_gte" fullWidth />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Filter>
  );
};

export const ProductList = (props: React.JSX.IntrinsicAttributes & ListProps<any>) => {
  const classes = useStyles();
  return (
    <List {...props} filters={<ProductFilter children={undefined} />} className={classes.root}>
      <Datagrid rowClick="show" className={classes.table}>
        <ImageField source="images[0].imageUrl" label="Image" />
        <TextField source="name" label="Nom" />
        <ReferenceField source="categoryId" reference="categories" label="Catégorie">
          <TextField source="name" />
        </ReferenceField>
        <NumberField source="price" label="Prix" options={{ style: 'currency', currency: 'XOF' }} />
        <NumberField source="stock" label="Stock" />
        <ReferenceField source="agripreneurId" reference="agripreneurs" label="Agripreneur">
          <TextField source="farmName" />
        </ReferenceField>
        <EditButton className={classes.actionButton} />
        <DeleteButton className={classes.actionButton} />
      </Datagrid>
    </List>
  );
};

const ProductTitle = ({ record }: { record?: { name: string } }) => {
  return <span>Produit {record ? `"${record.name}"` : ''}</span>;
};

export const ProductCreate = (props: any) => {
  const classes = useStyles();
  return (
    <Create {...props}>
      <SimpleForm>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" gutterBottom>Informations du produit</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextInput source="name" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumberInput source="price" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextInput source="description" multiline rows={4} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumberInput source="stock" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceInput source="categoryId" reference="categories">
                  <SelectInput optionText="name" validate={required()} fullWidth />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceInput source="subCategoryId" reference="subcategories">
                  <SelectInput optionText="name" validate={required()} fullWidth />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceInput source="agripreneurId" reference="agripreneurs">
                  <SelectInput optionText="farmName" validate={required()} fullWidth />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12}>
                <FileInput source="images" multiple accept={{ 'image/*': [] }} validate={required()}>
                  <FileField source="src" title="title" />
                </FileInput>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SimpleForm>
    </Create>
  );
};

export const ProductEdit = (props: any) => {
  const classes = useStyles();
  return (
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
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" gutterBottom>Modifier le produit</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextInput source="name" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumberInput source="price" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextInput source="description" multiline rows={4} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumberInput source="stock" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceInput source="categoryId" reference="categories">
                  <SelectInput optionText="name" fullWidth />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceInput source="subCategoryId" reference="subcategories">
                  <SelectInput optionText="name" fullWidth />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceInput source="agripreneurId" reference="agripreneurs">
                  <SelectInput optionText="farmName" fullWidth />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12}>
                <ArrayField source="images">
                  <SingleFieldList>
                    <ImageField source="imageUrl" title="Images actuelles" />
                  </SingleFieldList>
                </ArrayField>
              </Grid>
              <Grid item xs={12}>
                <FileInput source="images" multiple accept={{ 'image/*': [] }}>
                  <FileField source="src" title="title" />
                </FileInput>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SimpleForm>
    </Edit>
  );
};

export const ProductShow = (props: any) => {
  const classes = useStyles();
  return (
    <Show {...props} title={<ProductTitle />}>
      <TabbedShowLayout>
        <Tab label="Résumé">
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ImageField source="images[0].imageUrl" title="Image principale" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom><TextField source="name" /></Typography>
                  <Typography variant="h6" gutterBottom><NumberField source="price" options={{ style: 'currency', currency: 'XOF' }} /></Typography>
                  <Box my={2}>
                    <Chip icon={<Inventory />} label={<NumberField source="stock" />} className={classes.chip} />
                    <Chip icon={<Category />} label={<ReferenceField source="categoryId" reference="categories"><TextField source="name" /></ReferenceField>} className={classes.chip} />
                    <Chip icon={<Store />} label={<ReferenceField source="agripreneurId" reference="agripreneurs"><TextField source="farmName" /></ReferenceField>} className={classes.chip} />
                  </Box>
                  <Typography variant="body1" paragraph><TextField source="description" /></Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Tab>
        <Tab label="Images">
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <ArrayField source="images">
                <SingleFieldList>
                  <ImageField source="imageUrl" title="title" />
                </SingleFieldList>
              </ArrayField>
            </CardContent>
          </Card>
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};
