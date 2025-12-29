# Sistem Audit Log - Dokumentasi Implementasi

## Overview
Sistem audit log mencatat semua aktivitas penting dalam aplikasi untuk keperluan compliance, debugging, dan monitoring.

## Komponen Utama

### 1. `auditHelper.ts` - Service Layer
File: [src/utils/auditHelper.ts](src/utils/auditHelper.ts)

**Fungsi utama:**
```typescript
export async function logAudit(
  action: string,           // Jenis aksi (CREATE_ROLE, DELETE_ROLE, etc)
  actor: string,           // Nama pengguna yang melakukan aksi
  target: string,          // Target objek yang diubah
  changes?: string,        // Detail perubahan
  options?: {
    actorId?: string;           // ID pengguna (opsional)
    targetType?: string;        // Tipe target (Role, User, ReceivingOrder, etc)
    status?: 'success' | 'failed';  // Status operasi
    errorMessage?: string;      // Pesan error jika ada
  }
)
```

**Fitur:**
- Menggunakan `serverTimestamp()` untuk timestamp yang konsisten
- Automatic error logging ke console sebagai fallback
- Support untuk tracking status success/failed
- Log return ID untuk referensi

### 2. `AuditLog.tsx` - Display Component
File: [src/features/audit/AuditLog.tsx](src/features/audit/AuditLog.tsx)

**Fitur:**
- Menampilkan audit log dengan pagination (max 100 records)
- Filter berdasarkan status (success/failed)
- Expandable detail view untuk melihat changes dan errors
- Real-time updates via Firebase onSnapshot
- Format waktu otomatis ke timezone lokal (id-ID)
- Status badge dengan warna berbeda (green=success, red=failed)

**Props:**
- `filterStatus?: 'success' | 'failed' | 'all'` - Filter hasil

### 3. Implementasi di Features

#### RoleManagement.tsx
File: [src/features/users/RoleManagement.tsx](src/features/users/RoleManagement.tsx)

Audit actions:
- `CREATE_ROLE` - Saat membuat role baru
- `DELETE_ROLE` - Saat menghapus role
- `UPDATE_ROLE_PERMISSIONS` - Saat mengubah permissions
- `ASSIGN_ROLE` - Saat assign role ke user
- `REVOKE_ROLE` - Saat merevoke role dari user

Semua operasi dibungkus dalam try-catch untuk capture errors.

#### ReceivingManagement.tsx
File: [src/features/receiving/ReceivingManagement.tsx](src/features/receiving/ReceivingManagement.tsx)

Audit actions:
- `VERIFY_L1` - Verifikasi level 1 pada PO
- `VERIFY_L2` - Verifikasi level 2 pada PO

## Firestore Collection Structure

**Collection:** `auditLogs`

**Document Fields:**
```typescript
{
  id: string;           // Document ID (auto-generated)
  action: string;       // Jenis aksi
  actor: string;        // Nama aktor
  actorId?: string;     // ID aktor
  target: string;       // Target objek
  targetType?: string;  // Tipe target
  changes?: string;     // Detail perubahan
  timestamp: Timestamp; // Server timestamp
  status?: 'success' | 'failed';
  errorMessage?: string;
}
```

**Indexes yang diperlukan:**
- `status + timestamp (descending)` - Untuk filter status dengan ordering
- `timestamp (descending)` - Untuk query semua logs

## Usage Examples

### 1. Logging Successful Action
```typescript
import { logAudit } from "../../utils/auditHelper";

try {
  await updateRole(roleId, updatedRole);
  await logAudit(
    "UPDATE_ROLE",
    "admin@example.com",
    "Role: Admin",
    "Updated permissions",
    {
      targetType: "Role",
      status: 'success'
    }
  );
} catch (error) {
  await logAudit(
    "UPDATE_ROLE",
    "admin@example.com",
    "Role: Admin",
    "Failed to update permissions",
    {
      targetType: "Role",
      status: 'failed',
      errorMessage: String(error)
    }
  );
}
```

### 2. Menampilkan Audit Log
```typescript
import AuditLog from "../../features/audit/AuditLog";

// Tampilkan semua logs
<AuditLog />

// Tampilkan hanya logs yang failed
<AuditLog filterStatus="failed" />

// Tampilkan hanya logs yang success
<AuditLog filterStatus="success" />
```

## Best Practices

1. **Selalu gunakan try-catch**: Wrap audit logging dalam try-catch untuk handle errors
2. **Gunakan standardized action names**: Gunakan UPPER_SNAKE_CASE untuk action names
3. **Sertakan context detail**: Selalu isi `changes` field dengan detail spesifik
4. **Set targetType**: Sertakan `targetType` untuk memudahkan filtering
5. **Log baik success maupun failed**: Capture kedua outcome untuk troubleshooting

## Action Names Registry

Standardized action names yang digunakan:
- `CREATE_ROLE` - Membuat role baru
- `DELETE_ROLE` - Menghapus role
- `UPDATE_ROLE_PERMISSIONS` - Update role permissions
- `ASSIGN_ROLE` - Assign role ke user
- `REVOKE_ROLE` - Revoke role dari user
- `VERIFY_L1` - Verifikasi level 1
- `VERIFY_L2` - Verifikasi level 2
- `CREATE_USER` - Membuat user baru
- `UPDATE_USER` - Update user info
- `DELETE_USER` - Menghapus user

Tambahkan action baru sesuai kebutuhan, follow convention: `NOUN_VERB` atau `VERB_NOUN`

## Migration Guide untuk Features Existing

Untuk menambahkan audit logging ke feature existing:

1. Import `logAudit`:
   ```typescript
   import { logAudit } from "../../utils/auditHelper";
   ```

2. Wrap operasi dalam try-catch:
   ```typescript
   try {
     await performOperation();
     await logAudit("ACTION_NAME", actor, target, changes, options);
   } catch (error) {
     await logAudit("ACTION_NAME", actor, target, changes, {
       ...options,
       status: 'failed',
       errorMessage: String(error)
     });
   }
   ```

3. Gunakan descriptive messages dalam `changes` parameter

## Troubleshooting

### Logs tidak muncul
- Cek Firestore connection
- Verify permission untuk read `auditLogs` collection
- Check browser console untuk error messages

### Timestamp salah
- Pastikan browser timezone settings benar
- Gunakan `toLocaleString("id-ID")` untuk format konsisten

### Filter tidak bekerja
- Verify Firestore indexes dibuat
- Cek filter value (case sensitive)

## Future Improvements
- [ ] Add user authentication context ke logAudit
- [ ] Implement audit log retention policy
- [ ] Add export functionality (CSV, JSON)
- [ ] Add advanced search/filter UI
- [ ] Add audit log analytics dashboard
- [ ] Implement PII masking untuk sensitive data
