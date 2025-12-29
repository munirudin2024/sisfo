interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  location: string;
  lastUpdate: Date;
}

interface InventoryTableProps {
  products: Product[];
}

export default function InventoryTable({ products }: InventoryTableProps) {
  const getStatus = (quantity: number, minQuantity: number) => {
    if (quantity <= minQuantity) return { label: "Rendah", color: "warning" };
    if (quantity <= minQuantity * 1.5) return { label: "Normal", color: "warning" };
    return { label: "Optimal", color: "success" };
  };

  return (
    <div className="inventory-table-container card-widget">
      <h3>Inventory Management</h3>
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nama Produk</th>
              <th>Jumlah</th>
              <th>Min. Stok</th>
              <th>Status</th>
              <th>Lokasi</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = getStatus(product.quantity, product.minQuantity);
              return (
                <tr key={product.id}>
                  <td className="sku-cell">{product.sku}</td>
                  <td className="name-cell">{product.name}</td>
                  <td className="quantity-cell">{product.quantity}</td>
                  <td>{product.minQuantity}</td>
                  <td>
                    <span className={`status-badge status-${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td>{product.location}</td>
                  <td className="time-cell">{product.lastUpdate.toLocaleDateString("id-ID")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
