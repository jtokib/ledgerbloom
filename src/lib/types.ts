export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Member {
  id: string;
  uid: string;
  role: 'admin' | 'manager' | 'viewer';
  email: string;
  lastActiveAt: Date;
}

export interface Product {
  id: string;
  displayName: string;
  baseUOM: string; // 'lb', 'oz', 'each'
  active: boolean;
  variants: Variant[];
}

export interface Variant {
  id: string;
  sku: string;
  packageSize: string;
  barcode?: string;
  uom: string;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  type: 'warehouse' | 'store' | 'supplier';
  active: boolean;
}

export interface InventoryMovement {
  id: string;
  sku: string;
  locationId: string;
  qty: number;
  uom: string;
  direction: 'in' | 'out';
  cause: 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'production';
  occurredAt: Date;
  actor: string;
}

export interface InventoryLevel {
  id: string; // {sku}_{locationId}_{lotId?}
  sku: string;
  locationId: string;
  qty: number;
  uom: string;
  updatedAt: Date;
}
