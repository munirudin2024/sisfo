import { useState } from "react";
import UserManagement from "../../features/users/UserManagement";
import WarehouseManagement from "../../features/warehouse/WarehouseManagement";
import HandoverDocumentComponent from "../../features/auth/HandoverDocument";
import OnlineStore from "../../features/store/OnlineStore";
import type { User, Role, Department, Warehouse, Rack, Pallet, HandoverDocument, StoreProduct } from "../../types";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Mock data: 20 concrete WMS roles and 2 users per role (40 users)
  const roleNames = [
    "Admin",
    "Warehouse Manager",
    "Receiving Clerk",
    "Shipping Clerk",
    "Inventory Controller",
    "Quality Inspector",
    "Forklift Operator",
    "Supplier Manager",
    "Procurement",
    "Production Planner",
    "Store Manager",
    "Logistics Coordinator",
    "Returns Specialist",
    "Palletizer",
    "Safety Officer",
    "Maintenance Technician",
    "IT Support",
    "Customer Service",
    "Purchasing Manager",
    "Compliance Officer",
  ];

  const [roles] = useState<Role[]>(
    roleNames.map((name, idx) => ({
      id: `role-${idx + 1}`,
      name,
      description: `${name} role for WMS/SC operations`,
      permissions: [],
      departmentId: `dept-${(idx % 5) + 1}`,
      createdAt: new Date(),
    }))
  );

  // create 5 departments to spread roles across
  const [departments] = useState<Department[]>([
    { id: "dept-1", name: "Warehouse", description: "Main Warehouse", location: "Jakarta", managerId: "", isActive: true, createdAt: new Date() },
    { id: "dept-2", name: "Receiving", description: "Receiving Dept", location: "Jakarta", managerId: "", isActive: true, createdAt: new Date() },
    { id: "dept-3", name: "Shipping", description: "Shipping & Logistics", location: "Jakarta", managerId: "", isActive: true, createdAt: new Date() },
    { id: "dept-4", name: "Quality", description: "Quality & Inspection", location: "Jakarta", managerId: "", isActive: true, createdAt: new Date() },
    { id: "dept-5", name: "Procurement", description: "Procurement & Suppliers", location: "Jakarta", managerId: "", isActive: true, createdAt: new Date() },
  ]);

  const [users] = useState<User[]>(
    roles.flatMap((r, i) => {
      const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return [1, 2].map((n) => ({
        id: `${r.id}-u${n}`,
        email: `${slug}${n}@example.com`,
        displayName: `${r.name} ${n}`,
        roleIds: [r.id],
        departmentIds: [r.departmentId],
        isActive: true,
        createdAt: new Date(),
      }));
    })
  );

  const [warehouses] = useState<Warehouse[]>([
    {
      id: "wh-1",
      name: "Warehouse A",
      location: "Jakarta Pusat",
      capacity: 10000,
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  const [racks] = useState<Rack[]>([
    {
      id: "rack-1",
      warehouseId: "wh-1",
      rackCode: "A-01",
      level: 1,
      capacity: 500,
      currentLoad: 350,
      createdAt: new Date(),
    },
  ]);

  const [pallets] = useState<Pallet[]>([
    {
      id: "pallet-1",
      rackId: "rack-1",
      palletCode: "PAL-001",
      products: [{ id: "1", productId: "prod-1", quantity: 100 }],
      method: "FIFO",
      receivedDate: new Date(),
      createdAt: new Date(),
    },
  ]);

  const [documents] = useState<HandoverDocument[]>([
    {
      id: "doc-1",
      docNumber: "DOC-20241229-ABC12",
      type: "RECEIVING",
      referenceId: "ref-1",
      data: {},
      signatures: [],
      status: "DRAFT",
      departmentId: "dept-1",
      createdAt: new Date(),
    },
  ]);

  const [storeProducts] = useState<StoreProduct[]>([
    {
      id: "store-1",
      productId: "prod-1",
      name: "Additive Premium",
      description: "High quality additive for production",
      price: 150000,
      discount: 10,
      category: "Chemical",
      inStock: true,
      createdAt: new Date(),
    },
  ]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-banner">
        <div className="banner-content">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Kelola seluruh sistem warehouse Anda</p>
        </div>
      </div>

      <div className="admin-tabs">
        {[
          { id: "overview", label: "📊 Overview", icon: "📊" },
          { id: "users", label: "👥 Users", icon: "👥" },
          { id: "warehouse", label: "📦 Warehouse", icon: "📦" },
          { id: "documents", label: "📄 Documents", icon: "📄" },
          { id: "store", label: "🏪 Store", icon: "🏪" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === "overview" && (
          <div className="overview-grid">
            <div className="stat-box">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{users.length}</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <p className="stat-label">Departemen</p>
                <p className="stat-value">{departments.length}</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <p className="stat-label">Gudang</p>
                <p className="stat-value">{warehouses.length}</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">🛍️</div>
              <div className="stat-info">
                <p className="stat-label">Produk Toko</p>
                <p className="stat-value">{storeProducts.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <UserManagement
            users={users}
            departments={departments}
            roles={roles}
          />
        )}

        {activeTab === "warehouse" && (
          <WarehouseManagement
            warehouses={warehouses}
            racks={racks}
            pallets={pallets}
          />
        )}

        {activeTab === "documents" && (
          <HandoverDocumentComponent documents={documents} />
        )}

        {activeTab === "store" && (
          <OnlineStore products={storeProducts} isAdmin={true} />
        )}
      </div>
    </div>
  );
}
