# Spesifikasi WMS Supply Chain - SISFO

## 1. Fitur Gudang (Warehouse)
- ✅ Unlimited gudang (multi-warehouse support)
- ✅ Nama gudang, lokasi
- ✅ Capacity tracking

## 2. Fitur Rak & Lokasi Storage
- ✅ Unlimited rak per gudang
- ✅ Struktur: Gudang > Rak > Section/Level > Box > Palet
- ✅ Setiap item bisa tersebar di multiple gudang/rak/palet
- ✅ Display total item per kode + breakdown per lokasi (SANGAT PENTING)

## 3. Inventory Management - FIFO/FEFO

### FEFO (First Expired First Out) Rules:
- **Priority 1**: Expired date lebih awal → keluar lebih dulu
- **Priority 2**: Jika expired date SAMA → pakai FIFO (datang dulu keluar dulu)
- **Priority 3**: Ada NOTE/Desain baru:
  - Desain BARU datang → hold dulu
  - Desain LAMA → out habis dulu
  - THEN desain baru baru keluar

### Auto Popup "Stock Out":
- Auto alert ketika item siap untuk di-out
- Berdasarkan FEFO rules
- Label auto-generate dengan warna warning

## 4. Status Item
- ✅ **ACTIVE** - Ready untuk out
- ✅ **HOLD** - Untuk antisipasi problem tidak terencana
- ✅ **QUARANTINE** - Under inspection
- ✅ **RESERVED** - Untuk SO tertentu
- ✅ **DAMAGED** - Rusak/tidak bisa digunakan
- ✅ **EXPIRED** - Sudah melewati tanggal expired

## 5. Data Item yang Dicatat

### Core Info:
- Nama item
- Kode item (SKU)
- Kode barcode (scanned)
- PO number (dari receiving)
- Tgl masuk (auto dari receiving date)
- Tgl expired (auto dari receiving)

### Location Info:
- Gudang
- Rak
- Section/Level
- Box
- Palet
- Serial number/Lot number

### Quantity Info:
- Jumlah awal (from receiving)
- Jumlah saat ini (available)
- Jumlah reserved (dari SO)
- Jumlah on-hold
- Jumlah damaged

### Tracking:
- History pindah lokasi (complete audit trail)
- Status history
- Last moved date
- Last scanned date

## 6. Fitur Hold
- Prevent item dari di-out tanpa alasan
- Note untuk alasan hold
- Auto-release date (opsional)
- Notification saat ada item on-hold

## 7. Integration dengan Penerimaan (Receiving)

### Auto-populate:
- PO number
- Jumlah received
- Tgl received
- Supplier info
- Inspection status

### Stok Balance:
- Terima: Stok +
- Out (Shipping): Stok -
- Return: Stok +
- Adjustment: Manual dengan note

## 8. Integration dengan Pengiriman (Shipping)

### Auto-deduct:
- Ketika ada SO/Shipping, stok automatic reserve
- Ketika confirm shipped, stok automatic -
- Track stok per lokasi untuk efficient picking

## 9. Display & Analytics

### Summary Dashboard:
- Total item per SKU (sum dari semua lokasi)
- Breakdown per lokasi
- Item ready to ship (based on FEFO)
- Items on HOLD
- Expired items
- Total capacity usage

### Detailed View:
- Full item tree (Warehouse > Rak > Box > Palet > Item)
- Search by SKU/Barcode/PO
- Filter by status/expired date
- Export lokasi item (untuk picking)

### Warnings:
- Low stock alert
- Expired soon (30 hari)
- Expired now
- Capacity warning (>80%)
- Items on hold too long

## 10. Barcode Scanning Integration
- Scan untuk in-stok (receiving)
- Scan untuk out-stok (shipping)
- Scan untuk move lokasi
- Real-time quantity update

## 11. Multi-Level Warehouse Structure
```
Warehouse (Gudang)
├── Rack (Rak) - unlimited
│   ├── Section/Level
│   │   ├── Box/Bin
│   │   │   └── Palet
│   │   │       └── Items
```

## 12. Audit & Compliance
- Complete change history
- Who moved item
- When moved
- From-to lokasi
- Reason (if hold/quarantine)
- Stock reconciliation report

## Summary untuk Development:
1. **Types**: Enhanced Inventory, SKU, Location, InventoryMove, InventoryAudit
2. **Collection**: inventories, skus, warehouse-locations, inventory-moves
3. **Rules Engine**: FIFO/FEFO auto-determination
4. **Alert System**: Expired, Low stock, Hold notifications
5. **Report**: Stock position, Inventory accuracy, Movement history
