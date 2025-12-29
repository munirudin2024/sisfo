interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  color?: string;
  benchmark?: {
    value: number;
    target: number;
  };
}

interface WarehouseMetricsProps {
  metrics: MetricItem[];
  title?: string;
}

export default function WarehouseMetrics({
  metrics,
  title = "Metrik Warehouse",
}: WarehouseMetricsProps) {
  return (
    <div className="warehouse-metrics card-widget">
      {title && <h3>{title}</h3>}
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-item">
            {metric.icon && <div className="metric-icon">{metric.icon}</div>}
            <div className="metric-info">
              <p className="metric-label">{metric.label}</p>
              <p className="metric-value">
                {metric.value}
                {metric.unit && <span className="metric-unit">{metric.unit}</span>}
              </p>
              {metric.benchmark && (
                <div className="metric-benchmark">
                  <div className="benchmark-bar">
                    <div
                      className="benchmark-fill"
                      style={{
                        width: `${Math.min(
                          (metric.benchmark.value / metric.benchmark.target) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="benchmark-text">
                    {metric.benchmark.value} / {metric.benchmark.target}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
