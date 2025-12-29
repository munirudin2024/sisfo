import { useState, useMemo } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  category: string;
}

interface QuickSearchProps {
  products: Product[];
  onSelect?: (product: Product) => void;
}

export default function QuickSearch({ products, onSelect }: QuickSearchProps) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  return (
    <div className="quick-search-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Cari produk berdasarkan nama atau SKU..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onFocus={() => search.length > 0 && setShowResults(true)}
        />
      </div>

      {showResults && (
        <div className="search-results">
          {filteredProducts.length > 0 ? (
            <div className="results-list">
              {filteredProducts.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="result-item"
                  onClick={() => {
                    onSelect?.(product);
                    setSearch("");
                    setShowResults(false);
                  }}
                >
                  <div className="result-main">
                    <p className="result-name">{product.name}</p>
                    <p className="result-sku">{product.sku}</p>
                  </div>
                  <div className="result-quantity">
                    {product.quantity}
                    <span className="result-category">{product.category}</span>
                  </div>
                </div>
              ))}
              {filteredProducts.length > 8 && (
                <div className="results-more">
                  Tampilkan {filteredProducts.length - 8} hasil lagi...
                </div>
              )}
            </div>
          ) : (
            <div className="results-empty">
              <p>Produk tidak ditemukan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
