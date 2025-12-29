import CleaningInspection from "../../features/inspection/CleaningInspection";

export default function InspectionPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>✓ Inspeksi Kebersihan Gudang</h1>
        <p>Laporkan kondisi kebersihan dengan foto dokumentasi</p>
      </div>
      <CleaningInspection />
    </div>
  );
}
