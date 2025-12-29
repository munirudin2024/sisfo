import type { InventoryItem } from "../types";

/**
 * WMS Inventory Rules Engine
 * Handles FIFO/FEFO logic, auto-determination of shipping priority
 * Based on expiry date, received date, and design version
 */

export interface ShippingRuleResult {
  items: InventoryItem[];
  priority: number;
  reason: string;
  readyToShip: boolean;
}

/**
 * Determine shipping priority based on FIFO/FEFO rules
 * 
 * FEFO Rules:
 * 1. Priority = item with earliest expiry date (FEFO)
 * 2. If expiry date is same = use FIFO (earliest received date)
 * 3. If design note: NEW design received → HOLD, OUT OLD design first
 */
export function determineShippingPriority(items: InventoryItem[]): ShippingRuleResult {
  if (items.length === 0) {
    return {
      items: [],
      priority: 0,
      reason: "No items available",
      readyToShip: false,
    };
  }

  // Filter out expired and on-hold items
  const availableItems = items.filter(
    (item) => item.status !== "EXPIRED" && item.status !== "HOLD" && item.quantityAvailable > 0
  );

  if (availableItems.length === 0) {
    return {
      items: [],
      priority: 0,
      reason: "No available items (all expired or on-hold)",
      readyToShip: false,
    };
  }

  // Sort by FEFO/FIFO rules
  const sortedItems = sortByFIFOFEFO(availableItems);

  // Get highest priority item
  const highestPriorityItem = sortedItems[0];

  return {
    items: sortedItems,
    priority: 1,
    reason: `Ready for shipping - ${highestPriorityItem.storageMethod} method. Expiry: ${highestPriorityItem.expiryDate.toLocaleDateString(
      "id-ID"
    )}`,
    readyToShip: true,
  };
}

/**
 * Sort items by FEFO/FIFO rules
 * Priority order:
 * 1. Design-based: OLD designs first (if design note exists)
 * 2. FEFO: Earliest expiry date
 * 3. FIFO: Earliest received date (if expiry same)
 */
export function sortByFIFOFEFO(items: InventoryItem[]): InventoryItem[] {
  return [...items].sort((a, b) => {
    // Rule 1: Design-based sorting (if designVersion exists)
    if (a.designVersion && b.designVersion) {
      // Older design (lower version number or earlier) should go out first
      if (a.designVersion !== b.designVersion) {
        return a.designVersion.localeCompare(b.designVersion);
      }
    }

    // Rule 2: FEFO - Earlier expiry date first
    const expiryDiff = a.expiryDate.getTime() - b.expiryDate.getTime();
    if (expiryDiff !== 0) {
      return expiryDiff;
    }

    // Rule 3: FIFO - Earlier received date (if expiry same)
    const receivedDiff = a.receivedDate.getTime() - b.receivedDate.getTime();
    return receivedDiff;
  });
}

/**
 * Check if item is expiring soon (< 30 days)
 */
export function isExpiringSoon(item: InventoryItem, daysThreshold: number = 30): boolean {
  const today = new Date();
  const expiryTime = item.expiryDate.getTime();
  const todayTime = today.getTime();
  const diffTime = expiryTime - todayTime;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 && diffDays <= daysThreshold;
}

/**
 * Check if item is already expired
 */
export function isExpired(item: InventoryItem): boolean {
  return item.expiryDate < new Date();
}

/**
 * Get next item to ship based on FEFO/FIFO rules
 */
export function getNextItemToShip(items: InventoryItem[]): InventoryItem | null {
  const availableItems = items.filter(
    (item) => 
      item.status === "ACTIVE" && 
      item.quantityAvailable > 0 && 
      !isExpired(item)
  );

  if (availableItems.length === 0) return null;

  const sorted = sortByFIFOFEFO(availableItems);
  return sorted[0];
}

/**
 * Calculate inventory summary statistics
 */
export interface InventoryStats {
  totalItems: number;
  totalQuantity: number;
  activeQuantity: number;
  reservedQuantity: number;
  onHoldQuantity: number;
  damagedQuantity: number;
  readyToShip: number;
  expiredCount: number;
  expiringSoonCount: number;
  utilizationPercent: number;
}

export function calculateInventoryStats(
  items: InventoryItem[],
  warehouseCapacity: number
): InventoryStats {
  const stats: InventoryStats = {
    totalItems: items.length,
    totalQuantity: 0,
    activeQuantity: 0,
    reservedQuantity: 0,
    onHoldQuantity: 0,
    damagedQuantity: 0,
    readyToShip: 0,
    expiredCount: 0,
    expiringSoonCount: 0,
    utilizationPercent: 0,
  };

  items.forEach((item) => {
    stats.totalQuantity += item.quantityReceived;
    stats.activeQuantity += item.quantityAvailable;
    stats.reservedQuantity += item.quantityReserved;
    stats.onHoldQuantity += item.quantityOnHold;
    stats.damagedQuantity += item.quantityDamaged;

    if (item.isReadyToShip) {
      stats.readyToShip += item.quantityAvailable;
    }

    if (isExpired(item)) {
      stats.expiredCount += 1;
    } else if (isExpiringSoon(item)) {
      stats.expiringSoonCount += 1;
    }
  });

  stats.utilizationPercent = warehouseCapacity > 0 
    ? (stats.totalQuantity / warehouseCapacity) * 100 
    : 0;

  return stats;
}

/**
 * Check if item location is complete for picking
 * Validates warehouse, rack, palet info
 */
export function isLocationValid(item: InventoryItem): boolean {
  return !!(
    item.warehouseId &&
    item.rackId &&
    item.palletId &&
    item.warehouseName &&
    item.rackCode &&
    item.palletCode
  );
}

/**
 * Generate picking list for SO
 * Groups items by location for efficient picking
 */
export function generatePickingList(items: InventoryItem[]) {
  const pickingMap = new Map<string, InventoryItem[]>();

  items.forEach((item) => {
    const key = `${item.warehouseId}|${item.rackId}|${item.palletId}`;
    if (!pickingMap.has(key)) {
      pickingMap.set(key, []);
    }
    pickingMap.get(key)!.push(item);
  });

  const pickingList = Array.from(pickingMap.entries()).map(([key, items]) => {
    const [warehouseId, rackId, palletId] = key.split("|");
    const firstItem = items[0];
    return {
      location: {
        warehouse: firstItem.warehouseName,
        warehouseId,
        rack: firstItem.rackCode,
        rackId,
        palet: firstItem.palletCode,
        palletId,
      },
      items,
      totalQuantity: items.reduce((sum, i) => sum + i.quantityAvailable, 0),
    };
  });

  return pickingList;
}
