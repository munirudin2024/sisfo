import ReceivingManagement from "../../features/receiving/ReceivingManagement";

export default function ReceivingPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📥 Penerimaan Barang</h1>
        <p>Verifikasi dan terima barang masuk dengan sistem berlapis</p>
      </div>
      <ReceivingManagement orders={[]} currentUserId="current-user" />
    </div>
  );
}
