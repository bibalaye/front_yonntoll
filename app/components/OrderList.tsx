import React, { useEffect, useState } from 'react';

interface Order {
  id: string;
  clientName: string;
  totalAmount: number;
  status: string;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Échec de la récupération des commandes');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError("Une erreur s'est produite lors de la récupération des commandes");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Chargement des commandes...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div>
      <h2>Liste des commandes</h2>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Montant total</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.clientName}</td>
              <td>{order.totalAmount} €</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;