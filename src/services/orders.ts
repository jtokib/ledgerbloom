
'use server';
import type { Order } from '@/lib/types';
import { subDays } from 'date-fns';

/**
 * A mock service to fetch orders.
 * In a real application, this would fetch data from a database or API.
 */
export async function getOrders(): Promise<Order[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const now = new Date();

  return [
    {
      id: 'ORD-001',
      orderNumber: 'ORD-001',
      status: 'shipped',
      customerName: 'Green Thumb Nursery',
      createdAt: subDays(now, 2),
      items: [
        { sku: 'SKU-A1-L', name: 'Monstera Deliciosa (Large)', quantity: 2, price: 55.00 },
        { sku: 'SKU-R2-S', name: 'Rubber Plant (Small)', quantity: 5, price: 15.50 },
      ],
      totalValue: 187.50,
    },
    {
      id: 'ORD-002',
      orderNumber: 'ORD-002',
      status: 'processing',
      customerName: 'The Urban Jungle',
      createdAt: subDays(now, 1),
      items: [
        { sku: 'SKU-M3-M', name: 'Marble Queen Pothos (Medium)', quantity: 10, price: 22.00 },
      ],
      totalValue: 220.00,
    },
    {
      id: 'ORD-003',
      orderNumber: 'ORD-003',
      status: 'pending',
      customerName: 'City Blooms',
      createdAt: now,
      items: [
        { sku: 'SKU-T4-L', name: 'Fiddle Leaf Fig (Large)', quantity: 1, price: 85.00 },
        { sku: 'SKU-B5-S', name: 'Bird\'s Nest Fern (Small)', quantity: 3, price: 18.00 },
      ],
      totalValue: 139.00,
    },
    {
      id: 'ORD-004',
      orderNumber: 'ORD-004',
      status: 'delivered',
      customerName: 'Green Thumb Nursery',
      createdAt: subDays(now, 10),
      items: [
        { sku: 'SKU-A1-S', name: 'Monstera Deliciosa (Small)', quantity: 15, price: 25.00 },
      ],
      totalValue: 375.00,
    },
     {
      id: 'ORD-005',
      orderNumber: 'ORD-005',
      status: 'cancelled',
      customerName: 'The Urban Jungle',
      createdAt: subDays(now, 5),
      items: [
        { sku: 'SKU-R2-L', name: 'Rubber Plant (Large)', quantity: 3, price: 45.00 },
      ],
      totalValue: 135.00,
    },
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
