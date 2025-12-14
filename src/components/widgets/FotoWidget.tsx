// src/components/widgets/FotoWidget.tsx
type Props = {
  src: string; // path / url foto
  caption?: string; // opsional
};

export default function FotoWidget({ src, caption }: Props) {
  return (
    <div className="widget-card foto-widget">
      <img src={src} alt={caption || "gambar"} loading="lazy" />
      {caption && <p className="foto-caption">{caption}</p>}
    </div>
  );
}
