import { useState, useRef } from "react";
import type { BarcodeItem } from "../../types";

interface BarcodeRequestProps {
  type: "RAW_MATERIAL" | "PRODUCTION_MATERIAL";
  onSubmit?: (items: BarcodeItem[]) => void;
}

export default function BarcodeRequest({
  type,
  onSubmit,
}: BarcodeRequestProps) {
  const [items, setItems] = useState<BarcodeItem[]>([]);
  const [inputMode, setInputMode] = useState<"camera" | "manual">("camera");
  const [formData, setFormData] = useState({
    barcode: "",
    productName: "",
    quantity: 1,
  });
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Tidak dapat mengakses kamera");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const handleAddItem = () => {
    if (!formData.barcode && !formData.productName) {
      alert("Masukkan barcode atau nama produk");
      return;
    }

    const newItem: BarcodeItem = {
      id: Date.now().toString(),
      barcode: formData.barcode || undefined,
      productName: formData.productName,
      quantity: formData.quantity,
      manualEntry: inputMode === "manual",
    };

    setItems([...items, newItem]);
    setFormData({
      barcode: "",
      productName: "",
      quantity: 1,
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("Tambahkan minimal satu item");
      return;
    }
    onSubmit?.(items);
  };

  return (
    <div className="barcode-request card-widget">
      <div className="widget-header">
        <h3>Permintaan Material - {type}</h3>
        <span className="mode-indicator">{inputMode.toUpperCase()}</span>
      </div>

      <div className="mode-selector">
        <button
          className={`mode-btn ${inputMode === "camera" ? "active" : ""}`}
          onClick={() => {
            setInputMode("camera");
            if (cameraActive) stopCamera();
          }}
        >
          📷 Barcode Scanner
        </button>
        <button
          className={`mode-btn ${inputMode === "manual" ? "active" : ""}`}
          onClick={() => {
            setInputMode("manual");
            if (cameraActive) stopCamera();
          }}
        >
          ⌨️ Input Manual
        </button>
      </div>

      {inputMode === "camera" && (
        <div className="camera-section">
          {cameraActive ? (
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-feed"
              />
              <button
                className="btn-small btn-danger"
                onClick={stopCamera}
              >
                ⏹️ Stop Kamera
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={startCamera}
              style={{ width: "100%" }}
            >
              📷 Aktifkan Kamera
            </button>
          )}

          <div className="form-group">
            <label>Masukkan Barcode (atau copy paste)</label>
            <input
              type="text"
              value={formData.barcode}
              onChange={(e) =>
                setFormData({ ...formData, barcode: e.target.value })
              }
              placeholder="Scan atau paste barcode di sini"
              autoFocus
            />
          </div>
        </div>
      )}

      {inputMode === "manual" && (
        <div className="manual-section form-stack">
          <div className="form-group">
            <label>Nama Produk</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              placeholder="Masukkan nama produk"
            />
          </div>

          <div className="form-group">
            <label>Kuantitas</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Catatan (Opsional)</label>
            <textarea
              placeholder="Tambahkan catatan jika ada..."
              rows={3}
            />
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={handleAddItem}
        style={{ width: "100%", marginTop: "16px" }}
      >
        ➕ Tambah Item
      </button>

      <div className="items-list">
        <h4>Item yang Ditambahkan ({items.length})</h4>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-info">
                {item.barcode && (
                  <div className="item-barcode">
                    📦 {item.barcode}
                  </div>
                )}
                <div className="item-name">{item.productName}</div>
                <div className="item-qty">Qty: {item.quantity}</div>
                {item.manualEntry && (
                  <span className="badge badge-manual">Manual</span>
                )}
              </div>
              <button
                className="btn-xs btn-danger"
                onClick={() => handleRemoveItem(item.id)}
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Belum ada item. Mulai dengan menambahkan item.</p>
          </div>
        )}
      </div>

      <div className="form-actions" style={{ marginTop: "24px" }}>
        <button className="btn-primary" onClick={handleSubmit}>
          ✓ Kirim Permintaan
        </button>
        <button
          className="btn-secondary"
          onClick={() => {
            setItems([]);
            setFormData({ barcode: "", productName: "", quantity: 1 });
          }}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
