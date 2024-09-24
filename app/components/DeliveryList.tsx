import React, { useEffect, useState } from 'react';

interface Delivery {
  id: string;
  orderId: string;
  status: string;
  estimatedArrivalTime: string;
}

const DeliveryList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('/api/deliveries');
        if (!response.ok) {
          throw new Error('Échec de la récupération des livraisons');
        }
        const data = await response.json();
        setDeliveries(data);
      } catch (error) {
        setError("Une erreur s'est produite lors de la récupération des livraisons");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) {
    return <div>Chargement des livraisons...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div>
      <h2>Liste des livraisons</h2>
      <table>
        <thead>
          <tr>
            <th>ID Commande</th>
            <th>Statut</th>
            <th>Heure d'arrivée estimée</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td>{delivery.orderId}</td>
              <td>{delivery.status}</td>
              <td>{delivery.estimatedArrivalTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryList;