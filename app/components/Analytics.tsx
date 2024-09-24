import React, { useEffect, useState } from 'react';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Échec de la récupération des données analytiques');
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        setError("Une erreur s'est produite lors de la récupération des données analytiques");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Chargement des données analytiques...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div>
      <h2>Analytiques</h2>
      {analyticsData && (
        <div>
          <p>Ventes totales : {analyticsData.totalSales} €</p>
          <p>Nombre total de commandes : {analyticsData.totalOrders}</p>
          <p>Valeur moyenne des commandes : {analyticsData.averageOrderValue} €</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;