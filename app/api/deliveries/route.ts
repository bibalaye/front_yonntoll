import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const deliveries = await prisma.delivery.findMany({
      select: {
        id: true,
        orderId: true,
        status: true,
        estimatedArrivalTime: true,
      },
    });

    const formattedDeliveries = deliveries.map(delivery => ({
      id: delivery.id,
      orderId: delivery.orderId,
      status: delivery.status,
      estimatedArrivalTime: delivery.estimatedArrivalTime ? delivery.estimatedArrivalTime.toISOString() : null,
    }));

    return NextResponse.json(formattedDeliveries);
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des livraisons' }, { status: 500 });
  }
}