export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  settings: {
    defaultUOM: string;
    enableUOMConversions: boolean;
    inventoryCalculationMethod: 'realtime' | 'snapshot';
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'manager' | 'viewer';
  organizationId: string;
  lastActiveAt: Date;
}

export interface Product {
  id: string;
  displayName: string;
  baseUOM: string;
  active: boolean;
  variants: Variant[];
  imageUrl?: string;
  isKit: boolean;
  kitComposition?: KitComponent[];
  bomVersion?: number;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Variant {
  id: string;
  sku: string;
  packageSize: string;
  barcode?: string;
  uom: string;
  active: boolean;
  price: number;
  reorderPoint?: number;
}

export interface KitComponent {
  sku: string;
  quantity: number;
  uom: string;
}

export interface UOMConversion {
  id: string;
  fromUOM: string;
  toUOM: string;
  conversionFactor: number;
  organizationId: string;
  createdAt: Date;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  type: 'warehouse' | 'store' | 'supplier';
  active: boolean;
  organizationId: string;
}

export interface InventoryMovement {
  id: string;
  sku: string;
  locationId: string;
  qty: number;
  uom: string;
  direction: 'in' | 'out';
  cause: 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'production' | 'initial_stock' | 'kit_explosion';
  occurredAt: Date;
  actor: string;
  orderId?: string;
  batchId?: string;
  organizationId: string;
}

export interface InventorySnapshot {
  id: string;
  sku: string;
  locationId: string;
  calculatedQty: number;
  lastMovementId: string;
  snapshotAt: Date;
  organizationId: string;
  version: number;
}

export interface InventoryLevel {
  id: string;
  sku: string;
  locationId: string;
  qty: number;
  uom: string;
  updatedAt: Date;
  organizationId: string;
}
