import OnlineStore from "../../features/store/OnlineStore";

export default function StorePage() {
  return (
    <div className="page-container">
      <OnlineStore products={[]} isAdmin={false} />
    </div>
  );
}
