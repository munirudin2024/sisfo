import { useState } from "react";
import type { CleaningInspection } from "../../types";

const MAX_PHOTOS = 5;

export default function CleaningInspection() {
  const [inspections, setInspections] = useState<CleaningInspection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    locationName: "",
    notes: "",
    photos: [] as { file: File; preview: string }[],
  });
  const [photoCount, setPhotoCount] = useState(0);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_PHOTOS - photoCount;

    if (files.length > remainingSlots) {
      alert(
        `Anda hanya bisa upload ${remainingSlots} foto lagi (max ${MAX_PHOTOS})`
      );
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          photos: [
            ...prev.photos,
            {
              file,
              preview,
            },
          ],
        }));
        setPhotoCount((prev) => prev + 1);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotoCount((prev) => prev - 1);
  };

  const handleSubmitInspection = () => {
    if (!formData.locationName.trim()) {
      alert("Masukkan nama lokasi");
      return;
    }

    if (formData.photos.length === 0) {
      alert("Upload minimal 1 foto");
      return;
    }

    const newInspection: CleaningInspection = {
      id: Date.now().toString(),
      locationName: formData.locationName,
      inspectionDate: new Date(),
      photos: formData.photos.map((p, idx) => ({
        id: `photo-${idx}`,
        url: p.preview,
        timestamp: new Date(),
        description: undefined,
      })),
      notes: formData.notes || undefined,
      status: "PENDING_ACTION",
      inspectedBy: "current-user",
      departmentId: "dept-1",
      createdAt: new Date(),
    };

    setInspections([newInspection, ...inspections]);
    setFormData({
      locationName: "",
      notes: "",
      photos: [],
    });
    setPhotoCount(0);
    setShowForm(false);
  };

  return (
    <div className="inspection-management card-widget">
      <div className="widget-header">
        <h3>Inspeksi Kebersihan Gudang</h3>
        <button
          className="btn-small"
          onClick={() => setShowForm(!showForm)}
        >
          ➕ Laporan Baru
        </button>
      </div>

      {showForm && (
        <div className="inspection-form form-stack">
          <div className="form-group">
            <label>Lokasi Gudang</label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) =>
                setFormData({ ...formData, locationName: e.target.value })
              }
              placeholder="Contoh: Area A, Rak 1-5"
            />
          </div>

          <div className="form-group">
            <label>Catatan Inspeksi</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Deskripsi kondisi, masalah, atau rekomendasi..."
              rows={4}
            />
          </div>

          <div className="photo-upload">
            <label>Upload Foto ({photoCount}/{MAX_PHOTOS})</label>
            <div className="upload-area">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoSelect}
                disabled={photoCount >= MAX_PHOTOS}
                id="photo-input"
                style={{ display: "none" }}
              />
              <label
                htmlFor="photo-input"
                className="upload-label"
                style={{
                  opacity: photoCount >= MAX_PHOTOS ? 0.5 : 1,
                  cursor: photoCount >= MAX_PHOTOS ? "not-allowed" : "pointer",
                }}
              >
                <span>📸 Klik untuk upload atau drag & drop</span>
                <p>Max {MAX_PHOTOS} foto per laporan</p>
              </label>
            </div>

            {formData.photos.length > 0 && (
              <div className="photo-grid">
                {formData.photos.map((photo, idx) => (
                  <div key={idx} className="photo-item">
                    <img src={photo.preview} alt={`Preview ${idx + 1}`} />
                    <button
                      className="btn-remove-photo"
                      onClick={() => handleRemovePhoto(idx)}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={handleSubmitInspection}
            >
              ✓ Kirim Laporan
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  locationName: "",
                  notes: "",
                  photos: [],
                });
                setPhotoCount(0);
              }}
            >
              ❌ Batal
            </button>
          </div>
        </div>
      )}

      <div className="inspections-list">
        <h4>Laporan Terakhir</h4>
        {inspections.length > 0 ? (
          inspections.map((inspection) => (
            <div key={inspection.id} className="inspection-card">
              <div className="inspection-header">
                <h5>{inspection.locationName}</h5>
                <span
                  className={`status-badge status-${inspection.status.toLowerCase()}`}
                >
                  {inspection.status.replace("_", " ")}
                </span>
              </div>

              <div className="inspection-body">
                <div className="inspection-info">
                  <p>
                    <strong>Tanggal:</strong>{" "}
                    {inspection.inspectionDate.toLocaleDateString("id-ID")}
                  </p>
                  <p>
                    <strong>Foto:</strong> {inspection.photos.length} foto
                  </p>
                </div>

                {inspection.notes && (
                  <div className="inspection-notes">
                    <strong>Catatan:</strong> {inspection.notes}
                  </div>
                )}

                <div className="inspection-photos">
                  {inspection.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo.url}
                      alt={`Foto ${idx + 1}`}
                      className="inspection-photo-thumb"
                    />
                  ))}
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-xs">🔍 Lihat Detail</button>
                <button className="btn-xs">📋 Generate Laporan</button>
                <button className="btn-xs">✏️ Edit</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Belum ada laporan inspeksi</p>
          </div>
        )}
      </div>
    </div>
  );
}
