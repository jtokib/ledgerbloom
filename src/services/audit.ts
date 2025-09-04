
'use server';
import type { AuditLog } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';


/**
 * A service to fetch audit logs from Firestore.
 */
export async function getAuditLogs(): Promise<AuditLog[]> {
  const db = getDb();
  const logsCol = db.collection('audit_logs');
  const q = logsCol.orderBy('occurredAt', 'desc');
  const logsSnapshot = await q.get();
  
  const logList = logsSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
        id: doc.id, 
        ...data,
        occurredAt: data.occurredAt.toDate(),
    } as AuditLog
  });

  return logList;
}

/**
 * A service to create an audit log in Firestore.
 */
export async function createAuditLog(logData: Omit<AuditLog, 'id' | 'occurredAt'>): Promise<AuditLog> {
    const newLogData = {
        ...logData,
        occurredAt: new Date(),
    };

    const db = getDb();
    const logsCol = db.collection('audit_logs');
    const docRef = await logsCol.add(newLogData);
    
    return {
        ...newLogData,
        id: docRef.id,
    };
}
