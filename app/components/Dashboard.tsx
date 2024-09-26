import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LocalOfferOutlined, CategoryOutlined, PeopleOutlined, PersonOutlined, AttachMoneyOutlined, TrendingUpOutlined } from '@mui/icons-material';
import Modal from 'react-modal';

const Dashboard = () => {
  const { data: products } = useGetList('products', { pagination: { page: 1, perPage: 10 } });
  const { data: categories } = useGetList('categories', { pagination: { page: 1, perPage: 10 } });
  const { data: users } = useGetList('users', { pagination: { page: 1, perPage: 10 } });
  const { data: agripreneurs } = useGetList('agripreneurs', { pagination: { page: 1, perPage: 10 } });

  const salesData = [
    { name: 'Jan', ventes: 4000 },
    { name: 'Fév', ventes: 3000 },
    { name: 'Mar', ventes: 5000 },
    { name: 'Avr', ventes: 4500 },
    { name: 'Mai', ventes: 6000 },
    { name: 'Juin', ventes: 5500 },
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: '#CDEED6' }}>
      <Title title="Tableau de bord" />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#08651E', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Produits
              </Typography>
              <Box display="flex" alignItems="center">
                <LocalOfferOutlined sx={{ fontSize: 40, marginRight: 2 }} />
                <Typography variant="h4">{products?.length || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#10F24C', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Catégories
              </Typography>
              <Box display="flex" alignItems="center">
                <CategoryOutlined sx={{ fontSize: 40, marginRight: 2 }} />
                <Typography variant="h4">{categories?.length || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#08651E', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Utilisateurs
              </Typography>
              <Box display="flex" alignItems="center">
                <PersonOutlined sx={{ fontSize: 40, marginRight: 2 }} />
                <Typography variant="h4">{users?.length || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#10F24C', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Agripreneurs
              </Typography>
              <Box display="flex" alignItems="center">
                <PeopleOutlined sx={{ fontSize: 40, marginRight: 2 }} />
                <Typography variant="h4">{agripreneurs?.length || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Évolution des ventes
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventes" fill="#08651E" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Statistiques rapides
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Chiffre d'affaires</Typography>
                  <Box display="flex" alignItems="center">
                    <AttachMoneyOutlined sx={{ color: '#08651E', marginRight: 1 }} />
                    <Typography variant="h6">150,000 XOF</Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">Croissance</Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUpOutlined sx={{ color: '#10F24C', marginRight: 1 }} />
                    <Typography variant="h6">+15%</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
