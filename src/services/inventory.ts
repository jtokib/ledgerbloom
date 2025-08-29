
import type { InventoryLevel, InventoryMovement } from '@/lib/types';
import { getMovements } from './movements';

/**
 * A mock service to fetch inventory levels.
 * In a real application, this would fetch data from a database or API.
 * This function now calculates inventory levels from the movements log.
 */
export async function getInventoryLevels(): Promise<InventoryLevel[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const movements = await getMovements();

  const inventoryMap = new Map<string, InventoryLevel>();

  // Sort movements by date to process them in order
  movements.sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  for (const movement of movements) {
    const key = `${movement.sku}_${movement.locationId}`;
    
    let level = inventoryMap.get(key);

    if (!level) {
      level = {
        id: key,
        sku: movement.sku,
        locationId: movement.locationId,
        qty: 0,
        uom: movement.uom,
        updatedAt: movement.occurredAt,
      };
    }

    if (movement.direction === 'in') {
      level.qty += movement.qty;
    } else {
      level.qty -= movement.qty;
    }

    level.updatedAt = movement.occurredAt > level.updatedAt ? movement.occurredAt : level.updatedAt;
    level.uom = movement.uom; // Assume last movement's UOM is correct

    inventoryMap.set(key, level);
  }

  // Sort by SKU for consistent ordering
  return Array.from(inventoryMap.values()).sort((a, b) => a.sku.localeCompare(b.sku));
}
