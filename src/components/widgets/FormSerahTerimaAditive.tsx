// src/components/widgets/FormSerahTerimaAditive.tsx
import { useState } from "react";

export default function FormSerahTerimaAditive() {
  const [data, setData] = useState({
    tanggal: new Date().toISOString().substr(0, 10),
    shift: "Pagi",
    pengirim: "",
    penerima: "",
    jumlah: "",
    keterangan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSimpan = () => {
    console.log("Data disimpan:", data);
    alert("Data tersimpan (lihat console)");
    // nanti bisa kirim ke Firestore / cetak di sini
  };

  return (
    <div className="widget-card">
      <h4>Form Serah Terima Additive</h4>

      <div className="form-stack">
        <label>Tanggal</label>
        <input
          name="tanggal"
          type="date"
          value={data.tanggal}
          onChange={handleChange}
        />

        <label>Shift</label>
        <select name="shift" value={data.shift} onChange={handleChange}>
          <option>Pagi</option>
          <option>Siang</option>
          <option>Malam</option>
        </select>

        <label>Nama Pengirim</label>
        <input
          name="pengirim"
          placeholder="Pengirim"
          value={data.pengirim}
          onChange={handleChange}
        />

        <label>Nama Penerima</label>
        <input
          name="penerima"
          placeholder="Penerima"
          value={data.penerima}
          onChange={handleChange}
        />

        <label>Jumlah (kg)</label>
        <input
          name="jumlah"
          type="number"
          placeholder="0"
          value={data.jumlah}
          onChange={handleChange}
        />

        <label>Keterangan</label>
        <textarea
          name="keterangan"
          placeholder="Opsional"
          value={data.keterangan}
          onChange={handleChange}
          rows={2}
        />

        <button type="button" onClick={handleSimpan}>
          Simpan & Cetak
        </button>
      </div>
    </div>
  );
}
