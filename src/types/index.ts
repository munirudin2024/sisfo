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

// Warehouse Types - ENHANCED
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  totalLoad: number;
  managerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rack {
  id: string;
  warehouseId: string;
  rackCode: string;
  level: number;
  section?: string; // A, B, C, etc
  capacity: number;
  currentLoad: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Box {
  id: string;
  rackId: string;
  boxCode: string;
  capacity: number;
  currentLoad: number;
  createdAt: Date;
}

export interface Pallet {
  id: string;
  palletCode: string;
  warehouseId: string;
  rackId?: string;
  boxId?: string;
  inventoryItems: string[]; // Array of inventory item IDs
  totalQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// SKU & Inventory Types - ENHANCED
export interface SKU {
  id: string;
  code: string; // Unique SKU code
  name: string;
  description?: string;
  barcode: string; // For scanning
  category: 'RAW_MATERIAL' | 'PRODUCTION_MATERIAL' | 'FINISHED_GOODS' | 'ADDITIVE';
  unit: string; // pcs, kg, liter, etc
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  barcode: string;
  poNumber: string;
  lotNumber?: string;
  serialNumber?: string;
  
  // Location Info
  warehouseId: string;
  warehouseName: string;
  rackId: string;
  rackCode: string;
  boxId?: string;
  palletId: string;
  palletCode: string;
  
  // Quantity Tracking
  quantityReceived: number;
  quantityAvailable: number;
  quantityReserved: number; // For SO
  quantityOnHold: number;
  quantityDamaged: number;
  
  // Dates
  receivedDate: Date;
  expiryDate: Date;
  lastMovedDate: Date;
  lastScannedDate?: Date;
  
  // Status
  status: 'ACTIVE' | 'HOLD' | 'QUARANTINE' | 'RESERVED' | 'DAMAGED' | 'EXPIRED';
  holdReason?: string;
  holdUntilDate?: Date;
  
  // FIFO/FEFO Info
  storageMethod: 'FIFO' | 'FEFO';
  isReadyToShip: boolean; // Based on FIFO/FEFO rules
  shippingPriority: number; // 1 = highest priority
  
  // Notes
  notes?: string;
  designVersion?: string; // For design-based logic
  
  // Audit
  createdBy: string;
  lastUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryMove {
  id: string;
  inventoryItemId: string;
  skuCode: string;
  
  // From
  fromWarehouse: string;
  fromRack?: string;
  fromBox?: string;
  fromPallet: string;
  
  // To
  toWarehouse: string;
  toRack?: string;
  toBox?: string;
  toPallet: string;
  
  moveType: 'RELOCATION' | 'PICKING' | 'RESTOCKING' | 'CONSOLIDATION';
  reason?: string;
  
  movedBy: string;
  movedAt: Date;
  createdAt: Date;
}

export interface InventoryAudit {
  id: string;
  inventoryItemId: string;
  skuCode: string;
  
  changeType: 'RECEIVED' | 'SHIPPED' | 'ADJUSTED' | 'MOVED' | 'HOLD' | 'RELEASED' | 'DAMAGED' | 'EXPIRED';
  quantityChange: number;
  quantityBefore: number;
  quantityAfter: number;
  
  statusBefore?: string;
  statusAfter?: string;
  
  notes?: string;
  changedBy: string;
  relatedDocument?: string; // PO, SO, etc
  
  createdAt: Date;
}

export interface InventorySummary {
  skuCode: string;
  skuName: string;
  totalQuantity: number;
  totalAvailable: number;
  totalReserved: number;
  totalOnHold: number;
  totalDamaged: number;
  
  // Location breakdown
  locations: InventoryLocation[];
  
  // Status info
  readyToShip: number;
  readyToShipLocations: InventoryLocation[];
  
  expiredCount: number;
  expiringSoon: number; // < 30 days
  
  lastUpdated: Date;
}

export interface InventoryLocation {
  warehouseId: string;
  warehouseName: string;
  rackId: string;
  rackCode: string;
  boxId?: string;
  palletId: string;
  palletCode: string;
  quantity: number;
  status: string;
  expiryDate: Date;
  receivedDate: Date;
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
  // Extensions for destination & logistics
  destinationType?: 'STORE' | 'SUPPLIER';
  destinationName?: string;
  shippingAddress?: string;
  originWarehouse?: string;
  shippingMethod?: 'REGULAR' | 'EXPRESS' | 'TRUCK';
  carrier?: string;
  trackingNumber?: string;
  shippingCost?: number;
  notes?: string;
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
