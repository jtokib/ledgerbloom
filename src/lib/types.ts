

export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface User {
  id: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  role: 'admin' | 'manager' | 'viewer';
  organizationId: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: User['role'];
  invitedBy: string; // email of admin
  createdAt: Date;
  token: string;
  organizationId: string;
}


export interface Member {
  id: string;
  uid: string;
  role: 'admin' | 'manager' | 'viewer';
  email: string;
  lastActiveAt: Date;
  organizationId: string;
}

export interface Product {
  id: string;
  displayName: string;
  baseUOM: string; // 'lb', 'oz', 'each'
  active: boolean;
  variants: Variant[];
  imageUrl?: string;
  organizationId: string;
}

export interface Variant {
  id: string;
  sku: string;
  packageSize: string;
  barcode?: string;
  uom: string;
  active: boolean;
  price: number;
}

export interface Location {
  id:string;
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
  cause: 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'production';
  occurredAt: Date;
  actor: string;
  organizationId: string;
}

export interface InventoryLevel {
  id: string; // {sku}_{locationId}_{lotId?}
  sku: string;
  locationId: string;
  qty: number;
  uom: string;
  updatedAt: Date;
  organizationId: string;
}

export interface OrderItem {
    variantId: string;
    sku: string;
    quantity: number;
    name: string;
    price: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    customerName: string;
    createdAt: Date;
    items: OrderItem[];
    totalValue: number;
    organizationId: string;
}

export interface ExportLog {
  id: string;
  destination: string;
  status: 'Completed' | 'Pending' | 'Failed';
  triggeredBy: string; // email
  triggeredAt: Date;
  recordCount: {
    inventory: number;
    movements: number;
  };
  message?: string;
  organizationId: string;
}

export interface AuditLog {
  id: string;
  user: string; // email or system
  action: string; // e.g., 'product.create', 'location.update', 'export.run'
  occurredAt: Date;
  details: {
    entityType: string; // 'product', 'location', 'export'
    entityId: string;
    message: string;
  };
  organizationId: string;
}

export interface FulfillmentItem {
    sku: string;
    quantity: number;
}

export interface FulfillmentData {
    orderId: string;
    items: FulfillmentItem[];
    actor?: string; // Optional: who triggered the fulfillment
}
    
