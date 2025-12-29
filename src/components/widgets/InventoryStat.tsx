interface InventoryStatProps {
  label: string;
  value: string | number;
  icon: string;
  bgColor?: string;
  trend?: { direction: "up" | "down"; percent: number };
}

export default function InventoryStat({
  label,
  value,
  icon,
  bgColor = "#e3f2fd",
  trend,
}: InventoryStatProps) {
  return (
    <div className="stat-card" style={{ backgroundColor: bgColor }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {trend && (
          <p className={`stat-trend trend-${trend.direction}`}>
            {trend.direction === "up" ? "📈" : "📉"} {trend.percent}%
          </p>
        )}
      </div>
    </div>
  );
}
