import React from 'react';
import { Admin, Resource, Layout, AppBar, Menu, AppBarProps, MenuProps, LayoutProps } from 'react-admin';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ProductList, ProductEdit, ProductCreate, ProductShow } from './admin/Products';
import { CategoryList, CategoryEdit, CategoryCreate } from './admin/Categories';
import { AgripreneurList, AgripreneurEdit, AgripreneurCreate } from './admin/Agripreneurs';
import { UserList, UserEdit } from './admin/Users';
import { SubCategoryList, SubCategoryEdit, SubCategoryCreate } from './admin/SubCategories';
import dataProvider from './dataProvider';
import Dashboard from './Dashboard';
import { LocalOfferOutlined, CategoryOutlined, PeopleOutlined, PersonOutlined, SubdirectoryArrowRightOutlined } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#08651E',
    },
    secondary: {
      main: '#10F24C',
    },
  },
});

const CustomAppBar = (props: React.JSX.IntrinsicAttributes & AppBarProps) => (
  <AppBar {...props} color="primary" elevation={1} />
);

const CustomMenu = (props: React.JSX.IntrinsicAttributes & MenuProps) => (
  <Menu {...props}>
    <Menu.DashboardItem />
    <Menu.Item to="/products" primaryText="Produits" leftIcon={<LocalOfferOutlined />} />
    <Menu.Item to="/categories" primaryText="Catégories" leftIcon={<CategoryOutlined />} />
    <Menu.Item to="/subcategories" primaryText="Sous-catégories" leftIcon={<SubdirectoryArrowRightOutlined />} />
    <Menu.Item to="/agripreneurs" primaryText="Agripreneurs" leftIcon={<PeopleOutlined />} />
    <Menu.Item to="/users" primaryText="Utilisateurs" leftIcon={<PersonOutlined />} />
  </Menu>
);

const CustomLayout = (props: React.JSX.IntrinsicAttributes & LayoutProps) => <Layout {...props} appBar={CustomAppBar} menu={CustomMenu} />;

const AdminDashboard = () => (
  <ThemeProvider theme={theme}>
    <Admin 
      dataProvider={dataProvider}
      dashboard={Dashboard}
      layout={CustomLayout}
    >
      <Resource name="products" list={ProductList} edit={ProductEdit} create={ProductCreate} show={ProductShow} icon={LocalOfferOutlined} />
      <Resource name="categories" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} icon={CategoryOutlined} />
      <Resource name="subcategories" list={SubCategoryList} edit={SubCategoryEdit} create={SubCategoryCreate} icon={SubdirectoryArrowRightOutlined} />
      <Resource name="agripreneurs" list={AgripreneurList} edit={AgripreneurEdit} create={AgripreneurCreate} icon={PeopleOutlined} />
      <Resource name="users" list={UserList} edit={UserEdit} icon={PersonOutlined} />
    </Admin>
  </ThemeProvider>
);

export default AdminDashboard;