import BarcodeRequest from "../../features/barcode/BarcodeRequest";

export default function BarcodeRequestPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📱 Permintaan Material</h1>
        <p>Gunakan barcode atau input manual untuk permintaan material</p>
      </div>
      <BarcodeRequest type="RAW_MATERIAL" />
      <BarcodeRequest type="PRODUCTION_MATERIAL" />
    </div>
  );
}
