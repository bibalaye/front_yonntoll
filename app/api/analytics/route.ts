import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const totalSales = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    const totalOrders = await prisma.order.count();
    const totalAmount = Number(totalSales._sum.totalAmount) || 0;
    const averageOrderValue = totalAmount && totalOrders
      ? Number((totalAmount / totalOrders).toFixed(2))
      : 0;

    const analyticsData = {
      totalSales: totalAmount,
      totalOrders,
      averageOrderValue,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données analytiques:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des données analytiques' }, { status: 500 });
  }
}