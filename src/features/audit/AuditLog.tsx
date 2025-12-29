import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface AuditEntry {
  id?: string;
  action: string;
  actor: string;
  actorId?: string;
  target: string;
  targetType?: string;
  changes?: string;
  timestamp: any;
  status?: 'success' | 'failed';
  errorMessage?: string;
}

export default function AuditLog({ filterStatus }: { filterStatus?: 'success' | 'failed' | 'all' }) {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let q;
    
    if (filterStatus && filterStatus !== 'all') {
      q = query(
        collection(db, "auditLogs"),
        where("status", "==", filterStatus),
        orderBy("timestamp", "desc"),
        limit(100)
      );
    } else {
      q = query(
        collection(db, "auditLogs"),
        orderBy("timestamp", "desc"),
        limit(100)
      );
    }

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr: AuditEntry[] = [];
        snap.forEach((d) => {
          const data = d.data();
          arr.push({
            id: d.id,
            ...data,
            timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
          } as AuditEntry);
        });
        setLogs(arr);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching audit logs:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [filterStatus]);

  const formatTime = (timestamp: any) => {
    try {
      const date = timestamp instanceof Date ? timestamp : timestamp?.toDate?.() || new Date(timestamp);
      return date.toLocaleString("id-ID");
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const color = status === 'success' ? '#10b981' : '#ef4444';
    return (
      <span style={{
        padding: '2px 6px',
        backgroundColor: color + '20',
        color: color,
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: '600'
      }}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="audit-log card-widget">
      <div className="widget-header">
        <h3>📋 Audit Log ({logs.length})</h3>
      </div>

      {loading ? (
        <p>Memuat audit log...</p>
      ) : logs.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>Belum ada aktivitas</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table" style={{ fontSize: "13px" }}>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Aksi</th>
                <th>Aktor</th>
                <th>Target</th>
                <th>Tipe Target</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                    {formatTime(log.timestamp)}
                  </td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      backgroundColor: "#eff6ff",
                      color: "#0369a1",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px" }}>
                    <strong>{log.actor}</strong>
                    {log.actorId && <div style={{ fontSize: "11px", color: "#64748b" }}>{log.actorId}</div>}
                  </td>
                  <td style={{ fontSize: "12px" }}>{log.target}</td>
                  <td style={{ fontSize: "12px", color: "#64748b" }}>
                    {log.targetType || '-'}
                  </td>
                  <td>{getStatusBadge(log.status)}</td>
                  <td>
                    <button
                      onClick={() => setExpandedId(expandedId === log.id ? null : (log.id || null))}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#0369a1",
                        fontSize: "16px"
                      }}
                    >
                      {expandedId === log.id ? "▼" : "▶"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {expandedId && (
            <div style={{
              padding: "16px",
              backgroundColor: "#f8fafc",
              borderTop: "1px solid #e2e8f0",
              marginTop: "8px"
            }}>
              {(() => {
                const log = logs.find(l => l.id === expandedId);
                if (!log) return null;
                return (
                  <div>
                    <h4 style={{ marginTop: 0 }}>Detail:</h4>
                    <p><strong>Changes:</strong></p>
                    <pre style={{
                      backgroundColor: "white",
                      padding: "8px",
                      borderRadius: "4px",
                      overflowX: "auto",
                      fontSize: "12px"
                    }}>
                      {log.changes || 'N/A'}
                    </pre>
                    {log.errorMessage && (
                      <>
                        <p><strong>Error:</strong></p>
                        <pre style={{
                          backgroundColor: "#fee2e2",
                          padding: "8px",
                          borderRadius: "4px",
                          color: "#991b1b",
                          fontSize: "12px"
                        }}>
                          {log.errorMessage}
                        </pre>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
