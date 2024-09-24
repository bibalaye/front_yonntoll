import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        totalAmount: true,
        status: true,
      },
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      clientName: `${order.client.firstName} ${order.client.lastName}`,
      totalAmount: order.totalAmount,
      status: order.status,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des commandes' }, { status: 500 });
  }
}