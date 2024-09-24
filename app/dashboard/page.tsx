'use client';

import { useState } from 'react';
import { FaUsers, FaShoppingCart, FaBox, FaTruck, FaChartBar, FaCog } from 'react-icons/fa';
import ListUser from '../components/ListUser';
import ListAgripreneur from '../components/ListAgripreneur';
import ProductList from '../components/ProductList';
import CategoryList from '../components/CategoryList';
import OrderList from '../components/OrderList';
import DeliveryList from '../components/DeliveryList';
import Analytics from '../components/Analytics';
import Settings from '../components/Settings';

export default function DashboardPage() {
    const [activeComponent, setActiveComponent] = useState('users');

    const renderComponent = () => {
        switch(activeComponent) {
            case 'users':
                return <ListUser />;
            case 'agripreneurs':
                return <ListAgripreneur />;
            case 'products':
                return <ProductList />;
            case 'categories':
                return <CategoryList />;
            case 'orders':
                return <OrderList />;
            case 'deliveries':
                return <DeliveryList />;
            case 'analytics':
                return <Analytics />;
            case 'settings':
                return <Settings />;
            default:
                return <ListUser />;
        }
    };

    return (
        <div className="flex h-screen bg-[#CDEED6]">
            <aside className="w-64 bg-white shadow-lg rounded-r-3xl">
                <nav className="mt-5">
                    <a onClick={() => setActiveComponent('users')} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-[#08651E] hover:text-white cursor-pointer rounded-l-full ${activeComponent === 'users' ? 'bg-[#08651E] text-white' : ''}`}>
                        <FaUsers className="mr-3" />
                        Utilisateurs
                    </a>
                    <a onClick={() => setActiveComponent('agripreneurs')} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-[#08651E] hover:text-white cursor-pointer rounded-l-full ${activeComponent === 'agripreneurs' ? 'bg-[#08651E] text-white' : ''}`}>
                        <FaBox className="mr-3" />
                        Agripreneurs
                    </a>
                    <a onClick={() => setActiveComponent('products')} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-[#08651E] hover:text-white cursor-pointer rounded-l-full ${activeComponent === 'products' ? 'bg-[#08651E] text-white' : ''}`}>
                        <FaBox className="mr-3" />
                        Produits
                    </a>
                    <a onClick={() => setActiveComponent('categories')} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-[#08651E] hover:text-white cursor-pointer rounded-l-full ${activeComponent === 'categories' ? 'bg-[#08651E] text-white' : ''}`}>
                        <FaBox className="mr-3" />
                        Catégories
                    </a>
                    
                    <a onClick={() => setActiveComponent('orders')} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-[#08651E] hover:text-white cursor-pointer rounded-l-full ${activeComponent === 'orders' ? 'bg-[#08651E] text-white' : ''}`}>
                        <FaShoppingCart className="mr-3" />
                        Commandes
                    </a>
                    <a onClick={() => setActiveComponent('deliveries')} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-[#08651E] hover:text-white cursor-pointer rounded-l-full ${activeComponent === 'deliveries' ? 'bg-[#08651E] text-white' : ''}`}>
                        <FaTruck className="mr-3" />
                        Livraisons
                    </a>
                    <a onClick={() => setActiveComponent('analytics')} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-[#08651E] hover:text-white cursor-pointer rounded-l-full ${activeComponent === 'analytics' ? 'bg-[#08651E] text-white' : ''}`}>
                        <FaChartBar className="mr-3" />
                        Analytiques
                    </a>
                    <a onClick={() => setActiveComponent('settings')} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-[#08651E] hover:text-white cursor-pointer rounded-l-full ${activeComponent === 'settings' ? 'bg-[#08651E] text-white' : ''}`}>
                        <FaCog className="mr-3" />
                        Paramètres
                    </a>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-6 text-[#08651E] font-montserrat">Tableau de bord</h1>
                {renderComponent()}
            </main>
        </div>
    );
}