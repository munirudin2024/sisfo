export default function InfoPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>ℹ️ Informasi Sistem</h1>
        <p>Panduan, dokumentasi, dan informasi penting</p>
      </div>

      <div className="info-grid">
        <div className="info-card card-widget">
          <h3>📖 Panduan Pengguna</h3>
          <p>Pelajari cara menggunakan sistem WMS dengan panduan lengkap</p>
          <button className="btn-primary">Buka Panduan</button>
        </div>

        <div className="info-card card-widget">
          <h3>❓ FAQ</h3>
          <p>Pertanyaan yang sering diajukan dan jawabannya</p>
          <button className="btn-primary">Lihat FAQ</button>
        </div>

        <div className="info-card card-widget">
          <h3>📞 Support</h3>
          <p>Hubungi tim support untuk bantuan teknis</p>
          <button className="btn-primary">Hubungi Support</button>
        </div>

        <div className="info-card card-widget">
          <h3>⚙️ Pengaturan Sistem</h3>
          <p>Konfigurasi dan pengaturan sistem warehouse</p>
          <button className="btn-primary">Buka Pengaturan</button>
        </div>
      </div>
    </div>
  );
}
