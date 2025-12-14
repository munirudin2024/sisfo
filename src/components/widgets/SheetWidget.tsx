// src/components/widgets/SheetWidget.tsx
import { useEffect, useState } from "react";

type Props = {
  sheetUrl: string; // URL CSV (Google Sheets publish)
  title?: string;
};

type Row = string[];

export default function SheetWidget({ sheetUrl, title }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetch(sheetUrl)
      .then((r) => r.text())
      .then((text) => {
        const data: Row[] = text
          .trim()
          .split("\n")
          .map((line) =>
            line.split(",").map((cell) => cell.replace(/^"|"$/g, ""))
          );
        setRows(data);
      })
      .catch(() => setErr(true));
  }, [sheetUrl]);

  if (err) return <div className="widget-card">Gagal memuat data.</div>;
  if (rows.length === 0) return <div className="widget-card">Loading...</div>;

  const [header, ...body] = rows;

  return (
    <div className="widget-card sheet-widget">
      {title && <h4>{title}</h4>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {header.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
