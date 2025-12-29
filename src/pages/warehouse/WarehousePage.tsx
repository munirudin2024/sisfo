import WarehouseManagement from "../../features/warehouse/WarehouseManagement";

export default function WarehousePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Manajemen Gudang</h1>
        <p>Kelola rak, palet, dan penyimpanan gudang Anda</p>
      </div>
      <WarehouseManagement warehouses={[]} racks={[]} pallets={[]} />
    </div>
  );
}
