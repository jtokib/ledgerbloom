import type { InventoryMovement } from '@/lib/types';

const mockMovements: InventoryMovement[] = [
    {
        id: 'mov_1',
        sku: 'SKU-A1-L',
        locationId: 'main-warehouse',
        qty: 1500,
        uom: 'each',
        direction: 'in',
        cause: 'purchase',
        occurredAt: new Date('2023-10-01'),
        actor: 'user_admin',
    },
    {
        id: 'mov_2',
        sku: 'SKU-R2-S',
        locationId: 'downtown-store',
        qty: 100,
        uom: 'each',
        direction: 'in',
        cause: 'transfer',
        occurredAt: new Date('2023-10-02'),
        actor: 'user_admin',
    },
    {
        id: 'mov_3',
        sku: 'SKU-A1-L',
        locationId: 'main-warehouse',
        qty: 295,
        uom: 'each',
        direction: 'out',
        cause: 'sale',
        occurredAt: new Date('2023-10-26'),
        actor: 'user_jane',
    },
    {
        id: 'mov_4',
        sku: 'SKU-R2-S',
        locationId: 'downtown-store',
        qty: 48,
        uom: 'each',
        direction: 'out',
        cause: 'sale',
        occurredAt: new Date('2023-10-28'),
        actor: 'user_jane',
    },
    {
        id: 'mov_5',
        sku: 'SKU-B5-S',
        locationId: 'downtown-store',
        qty: 10,
        uom: 'each',
        direction: 'out',
        cause: 'adjustment',
        occurredAt: new Date('2023-10-29'),
        actor: 'user_admin',
    },
     {
        id: 'mov_6',
        sku: 'SKU-T4-L',
        locationId: 'eastside-warehouse',
        qty: 500,
        uom: 'each',
        direction: 'in',
        cause: 'purchase',
        occurredAt: new Date('2023-09-10'),
        actor: 'user_admin',
    },
    {
        id: 'mov_7',
        sku: 'SKU-T4-L',
        locationId: 'eastside-warehouse',
        qty: 50,
        uom: 'each',
        direction: 'out',
        cause: 'transfer',
        occurredAt: new Date('2023-09-15'),
        actor: 'user_admin',
    }
];


/**
 * A mock service to fetch inventory movements.
 * In a real application, this would fetch data from a database or API.
 */
export async function getMovements(): Promise<InventoryMovement[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return in reverse chronological order
  return mockMovements.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
}
