import { useState } from "react";
import WarehouseManagement from "../../features/warehouse/WarehouseManagement";
import type { Warehouse } from "../../types";

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "wh-1",
      name: "Warehouse A (Main)",
      location: "Jakarta Pusat",
      capacity: 5000,
      totalLoad: 3250,
      managerId: "user-1",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "wh-2",
      name: "Warehouse B (Backup)",
      location: "Jakarta Timur",
      capacity: 3000,
      totalLoad: 1800,
      managerId: "user-2",
      isActive: true,
      createdAt: new Date("2024-06-01"),
      updatedAt: new Date("2024-06-01"),
    },
  ]);

  const handleAddWarehouse = (warehouse: Partial<Warehouse>) => {
    const newWh: Warehouse = {
      id: `wh-${Date.now()}`,
      name: warehouse.name || "New Warehouse",
      location: warehouse.location || "Location",
      capacity: warehouse.capacity || 0,
      totalLoad: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWarehouses([...warehouses, newWh]);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Manajemen Gudang & Inventory WMS</h1>
        <p>Kelola warehouse, rak, inventory dengan FIFO/FEFO automation</p>
      </div>
      <WarehouseManagement warehouses={warehouses} onAddWarehouse={handleAddWarehouse} />
    </div>
  );
}
