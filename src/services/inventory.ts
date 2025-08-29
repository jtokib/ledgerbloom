import type { InventoryLevel } from '@/lib/types';

const mockInventoryLevels: InventoryLevel[] = [
  {
    id: 'SKU-A1-L_main-warehouse',
    sku: 'SKU-A1-L',
    locationId: 'main-warehouse',
    qty: 1205,
    uom: 'each',
    updatedAt: new Date('2023-10-26'),
  },
  {
    id: 'SKU-R2-S_downtown-store',
    sku: 'SKU-R2-S',
    locationId: 'downtown-store',
    qty: 52,
    uom: 'each',
    updatedAt: new Date('2023-10-28'),
  },
  {
    id: 'SKU-M3-M_main-warehouse',
    sku: 'SKU-M3-M',
    locationId: 'main-warehouse',
    qty: 780,
    uom: 'each',
    updatedAt: new Date('2023-10-22'),
  },
  {
    id: 'SKU-T4-L_eastside-warehouse',
    sku: 'SKU-T4-L',
    locationId: 'eastside-warehouse',
    qty: 450,
    uom: 'each',
    updatedAt: new Date('2023-09-15'),
  },
  {
    id: 'SKU-B5-S_downtown-store',
    sku: 'SKU-B5-S',
    locationId: 'downtown-store',
    qty: -10,
    uom: 'each',
    updatedAt: new Date('2023-10-29'),
  },
  {
    id: 'SKU-A1-S_main-warehouse',
    sku: 'SKU-A1-S',
    locationId: 'main-warehouse',
    qty: 2500,
    uom: 'each',
    updatedAt: new Date('2023-10-20'),
  },
  {
    id: 'SKU-R2-L_eastside-warehouse',
    sku: 'SKU-R2-L',
    locationId: 'eastside-warehouse',
    qty: 300,
    uom: 'each',
    updatedAt: new Date('2023-08-01'),
  },
];


/**
 * A mock service to fetch inventory levels.
 * In a real application, this would fetch data from a database or API.
 */
export async function getInventoryLevels(): Promise<InventoryLevel[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockInventoryLevels;
}