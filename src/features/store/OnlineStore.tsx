import { useState } from "react";
import type { StoreProduct } from "../../types";

interface OnlineStoreProps {
  products: StoreProduct[];
  isAdmin: boolean;
}

export default function OnlineStore({
  products,
  isAdmin,
}: OnlineStoreProps) {
  const [viewMode, setViewMode] = useState<"browse" | "admin">(
    isAdmin ? "admin" : "browse"
  );
  const [cart, setCart] = useState<(StoreProduct & { quantity: number })[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    category: "",
    image: "",
  });

  const categories = [...new Set(products.map((p) => p.category))];
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: StoreProduct) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="online-store">
      <div className="store-header">
        <h2>🏪 Toko Online</h2>
        {isAdmin && (
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === "browse" ? "active" : ""}`}
              onClick={() => setViewMode("browse")}
            >
              🛍️ Tampilan Pembeli
            </button>
            <button
              className={`toggle-btn ${viewMode === "admin" ? "active" : ""}`}
              onClick={() => setViewMode("admin")}
            >
              ⚙️ Kelola Produk
            </button>
          </div>
        )}
      </div>

      {viewMode === "browse" && (
        <div className="store-browse">
          <div className="category-filter">
            <button
              className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.image && (
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.discount && (
                      <div className="discount-badge">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                )}

                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-description">{product.description}</p>

                  <div className="product-footer">
                    <div className="price-section">
                      {product.discount ? (
                        <>
                          <span className="original-price">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                          <span className="final-price">
                            Rp{" "}
                            {(
                              product.price *
                              (1 - product.discount / 100)
                            ).toLocaleString("id-ID")}
                          </span>
                        </>
                      ) : (
                        <span className="final-price">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>

                    <button
                      className="btn-small btn-primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? "🛒 Beli" : "❌ Stok Habis"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="shopping-cart">
              <h3>🛒 Keranjang Belanja ({cart.length})</h3>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>Rp {item.price.toLocaleString("id-ID")}</td>
                      <td>{item.quantity}</td>
                      <td>
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </td>
                      <td>
                        <button
                          className="btn-xs"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="cart-summary">
                <h4>Total: Rp {cartTotal.toLocaleString("id-ID")}</h4>
                <div className="cart-actions">
                  <button className="btn-primary">✓ Checkout</button>
                  <button className="btn-secondary" onClick={() => setCart([])}>
                    🗑️ Kosongkan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === "admin" && (
        <div className="store-admin">
          <div className="admin-header">
            <button
              className="btn-small btn-primary"
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    discount: 0,
                    category: "",
                    image: "",
                  });
                }
              }}
            >
              ➕ Tambah Produk
            </button>
          </div>

          {showForm && (
            <div className="product-form card-widget">
              <h4>Form Produk</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Harga</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseInt(e.target.value) })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Diskon (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: parseInt(e.target.value),
                      })
                    }
                    max="100"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={() => setShowForm(false)}>
                  ✓ Simpan
                </button>
                <button className="btn-secondary" onClick={() => setShowForm(false)}>
                  Batal
                </button>
              </div>
            </div>
          )}

          <div className="products-admin-list">
            {products.map((product) => (
              <div key={product.id} className="admin-product-card">
                <div className="admin-product-info">
                  <h4>{product.name}</h4>
                  <p>Kategori: {product.category}</p>
                  <p>
                    Harga: Rp {product.price.toLocaleString("id-ID")}
                    {product.discount && ` (-${product.discount}%)`}
                  </p>
                  <p>
                    Status: {product.inStock ? "✓ Tersedia" : "❌ Habis"}
                  </p>
                </div>

                <div className="admin-product-actions">
                  <button className="btn-xs">✏️ Edit</button>
                  <button className="btn-xs">📸 Foto</button>
                  <button className="btn-xs btn-danger">🗑️ Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
