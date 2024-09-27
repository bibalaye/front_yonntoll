import React from 'react';
import { List, Datagrid, TextField, ImageField, EditButton, DeleteButton, Create, Edit, SimpleForm, TextInput, ImageInput, required, ListProps, CreateProps, EditProps, FileInput } from 'react-admin';
import { useRecordContext } from 'react-admin';
import { Button, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Category, Add, Edit as EditIcon } from '@mui/icons-material';

const useStyles = makeStyles({
  root: {
    '& .MuiPaper-root': {
      backgroundColor: '#CDEED6',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  },
  header: {
    backgroundColor: '#08651E',
    color: 'white',
    padding: '20px',
    borderRadius: '12px 12px 0 0',
  },
  card: {
    margin: '10px 0',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  button: {
    backgroundColor: '#10F24C',
    color: '#08651E',
    '&:hover': {
      backgroundColor: '#08651E',
      color: '#FFFFFF',
    },
  },
});

const CategoryTitle = ({ record }: { record?: { name: string } }) => {
  const classes = useStyles();
  return (
    <Typography variant="h4" className={classes.header}>
      <Category /> {record ? `Catégorie "${record.name}"` : 'Nouvelle Catégorie'}
    </Typography>
  );
};

const CategoryList = (props: ListProps) => {
  const classes = useStyles();
  return (
    <List {...props} className={classes.root}>
      <Box mb={2}>
        <Typography variant="h4" className={classes.header}>
          <Category /> Gestion des Catégories
        </Typography>
      </Box>
      <Datagrid rowClick="edit">
        <ImageField source="imageUrl" title="Image" />
        <TextField source="name" />
        <EditButton />
        <DeleteButton />
        <SubCategoriesButton />
      </Datagrid>
    </List>
  );
};

const SubCategoriesButton = () => {
  const classes = useStyles();
  const record = useRecordContext();
  return (
    <Button
      component={Link}
      to={`/subcategories?filter=${JSON.stringify({ categoryId: record?.id })}`}
      className={classes.button}
      startIcon={<Category />}
    >
      Sous-catégories
    </Button>
  );
};

const CategoryCreate = (props: CreateProps) => {
  const classes = useStyles();
  return (
    <Create {...props} title={<CategoryTitle />}>
      <SimpleForm>
        <Card className={classes.card}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextInput source="name" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <ImageInput source="image" accept={{ 'image/*': [] }} placeholder={<p>Glissez et déposez une image ici</p>}>
                  <ImageField source="src" title="title" />
                </ImageInput>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SimpleForm>
    </Create>
  );
};

const CategoryEdit = (props: EditProps) => {
  const classes = useStyles();
  return (
    <Edit {...props} title={<CategoryTitle />}
      transform={(data) => {
        if (!data.image || !data.image.rawFile) {
          const { image, ...rest } = data;
          return rest;
        }
        return data;
      }}>
      <SimpleForm>
        <Card className={classes.card}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextInput source="name" validate={required()} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <ImageInput source="image" accept={{ 'image/*': [] }} placeholder={<p>Glissez et déposez une nouvelle image ici</p>}>
                  <ImageField source="src" title="title" />
                </ImageInput>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Image actuelle :</Typography>
                <ImageField source="imageUrl" title="Image actuelle" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SimpleForm>
    </Edit>
  );
};

export { CategoryList, CategoryCreate, CategoryEdit };
