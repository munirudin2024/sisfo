import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export interface AuditLogEntry {
  action: string;
  actor: string;
  actorId?: string;
  target: string;
  targetType?: string;
  changes?: string;
  timestamp?: any;
  status?: 'success' | 'failed';
  errorMessage?: string;
}

export async function logAudit(
  action: string,
  actor: string,
  target: string,
  changes?: string,
  options?: {
    actorId?: string;
    targetType?: string;
    status?: 'success' | 'failed';
    errorMessage?: string;
  }
) {
  try {
    const entry: AuditLogEntry = {
      action,
      actor,
      target,
      changes,
      timestamp: serverTimestamp(),
      actorId: options?.actorId,
      targetType: options?.targetType,
      status: options?.status || 'success',
      errorMessage: options?.errorMessage,
    };

    const result = await addDoc(collection(db, "auditLogs"), entry);
    console.log(`[AUDIT] ${action} by ${actor} on ${target} - ID: ${result.id}`);
    return result.id;
  } catch (e) {
    console.error("Audit log error:", e);
    // Fallback: log to console if Firebase fails
    console.error(`[AUDIT_FAILED] ${action} by ${actor} on ${target}: ${e}`);
    throw e;
  }
}
