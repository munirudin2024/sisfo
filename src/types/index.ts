// User & Auth Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  roleIds: string[];
  departmentIds: string[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  departmentId: string;
  createdAt: Date;
}

export interface Permission {
  id: string;
  action: string; // 'create', 'read', 'update', 'delete'
  resource: string; // 'user', 'product', 'warehouse', etc
}

export interface Department {
  id: string;
  name: string;
  description: string;
  location?: string;
  managerId: string;
  isActive: boolean;
  createdAt: Date;
}

// Warehouse Types
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Rack {
  id: string;
  warehouseId: string;
  rackCode: string;
  level: number;
  capacity: number;
  currentLoad: number;
  createdAt: Date;
}

export interface Pallet {
  id: string;
  rackId: string;
  palletCode: string;
  products: PalletItem[];
  method: 'FIFO' | 'FEFO';
  receivedDate: Date;
  expiryDate?: Date;
  createdAt: Date;
}

export interface PalletItem {
  id: string;
  productId: string;
  quantity: number;
  serial?: string;
}

// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: 'RAW_MATERIAL' | 'PRODUCTION_MATERIAL' | 'FINISHED_GOODS';
  quantity: number;
  minQuantity: number;
  barcode?: string;
  hasBarcode: boolean;
  price: number;
  supplier?: string;
  createdAt: Date;
}

// Receiving Types
export interface ReceivingOrder {
  id: string;
  poNumber: string;
  supplier: string;
  items: ReceivingItem[];
  status: 'PENDING' | 'VERIFIED_L1' | 'VERIFIED_L2' | 'COMPLETED';
  verifiedBy1?: string; // User ID
  verifiedBy2?: string; // User ID
  receivedDate: Date;
  completedDate?: Date;
  departmentId: string;
  createdAt: Date;
}

export interface ReceivingItem {
  id: string;
  productId: string;
  skuExpected: string;
  skuActual?: string;
  quantityExpected: number;
  quantityActual?: number;
  notes?: string;
  hasDiscrepancy: boolean;
}

// Shipping Types
export interface ShippingOrder {
  id: string;
  doNumber: string;
  customer: string;
  items: ShippingItem[];
  status: 'PENDING' | 'VERIFIED_L1' | 'VERIFIED_L2' | 'SHIPPED';
  verifiedBy1?: string;
  verifiedBy2?: string;
  shippingDate?: Date;
  completedDate?: Date;
  departmentId: string;
  createdAt: Date;
}

export interface ShippingItem {
  id: string;
  productId: string;
  sku: string;
  quantityRequested: number;
  quantityActual?: number;
  notes?: string;
  hasDiscrepancy: boolean;
}

// Barcode Types
export interface BarcodeRequest {
  id: string;
  requestNumber: string;
  type: 'RAW_MATERIAL' | 'PRODUCTION_MATERIAL';
  items: BarcodeItem[];
  status: 'PENDING' | 'VERIFIED' | 'COMPLETED';
  departmentId: string;
  requestedBy: string;
  createdAt: Date;
}

export interface BarcodeItem {
  id: string;
  barcode?: string;
  productName: string;
  quantity: number;
  manualEntry: boolean;
  notes?: string;
}

// Inspection Types
export interface CleaningInspection {
  id: string;
  locationName: string;
  inspectionDate: Date;
  photos: InspectionPhoto[];
  notes?: string;
  status: 'PASS' | 'FAIL' | 'PENDING_ACTION';
  inspectedBy: string;
  departmentId: string;
  createdAt: Date;
}

export interface InspectionPhoto {
  id: string;
  url: string;
  timestamp: Date;
  description?: string;
}

// Document Types
export interface HandoverDocument {
  id: string;
  docNumber: string;
  type: 'RECEIVING' | 'SHIPPING' | 'INSPECTION' | 'OTHER';
  referenceId: string; // Link to original document
  data: Record<string, any>;
  signatures: DocumentSignature[];
  status: 'DRAFT' | 'SIGNED' | 'ARCHIVED';
  departmentId: string;
  createdAt: Date;
}

export interface DocumentSignature {
  id: string;
  userId: string;
  timestamp: Date;
  ipAddress?: string;
}

// Store Types
export interface StoreProduct {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  image?: string;
  inStock: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  storeProductId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// System Configuration
export interface SystemConfig {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  maxPhotoPerInspection: number;
  fifoEnabled: boolean;
  fefoEnabled: boolean;
}
