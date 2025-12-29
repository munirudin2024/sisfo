interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  icon: string;
  severity?: "info" | "warning" | "success" | "error";
}

interface ActivityLogProps {
  activities: Activity[];
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes}m lalu`;
    if (hours < 24) return `${hours}h lalu`;
    if (days < 7) return `${days}d lalu`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="activity-log card-widget">
      <h3>Aktivitas Terbaru</h3>
      <div className="activity-list">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className={`activity-item severity-${activity.severity || "info"}`}>
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <p className="activity-description">{activity.description}</p>
              </div>
              <div className="activity-time">{formatTime(activity.timestamp)}</div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Tidak ada aktivitas</p>
          </div>
        )}
      </div>
    </div>
  );
}
