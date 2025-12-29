import { useState } from "react";

interface DocumentViewerProps {
  title: string;
  documents: Array<{
    id: string;
    name: string;
    type: "excel" | "pptx" | "pdf" | "doc" | "docx";
    url: string;
    icon?: string;
  }>;
}

export default function DocumentViewer({ title, documents }: DocumentViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const getIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      excel: "📊",
      pptx: "📽️",
      pdf: "📄",
      doc: "📝",
      docx: "📝",
    };
    return icons[type] || "📎";
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="document-viewer card-widget">
      <div className="widget-header">
        <h3>{title}</h3>
        <span className="doc-count">{documents.length}</span>
      </div>

      <div className="document-grid">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`document-card ${selectedDoc === doc.id ? "active" : ""}`}
            onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
          >
            <div className="doc-icon">{getIcon(doc.type)}</div>
            <div className="doc-info">
              <p className="doc-name">{doc.name}</p>
              <p className="doc-type">{doc.type.toUpperCase()}</p>
            </div>
            <div className="doc-actions">
              <button
                className="btn-small btn-download"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(doc.url, doc.name);
                }}
                title="Download"
              >
                ⬇️
              </button>
              {doc.type === "pdf" || doc.type === "pptx" ? (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-small btn-view"
                  onClick={(e) => e.stopPropagation()}
                  title="View Online"
                >
                  👁️
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="empty-state">
          <p>Tidak ada dokumen tersedia</p>
        </div>
      )}
    </div>
  );
}
