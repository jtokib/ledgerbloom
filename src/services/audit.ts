
'use server';
import type { AuditLog } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';


/**
 * A service to fetch audit logs from Firestore.
 */
export async function getAuditLogs(): Promise<AuditLog[]> {
  const logsCol = collection(db, 'audit_logs');
  const q = query(logsCol, orderBy('occurredAt', 'desc'));
  const logsSnapshot = await getDocs(q);
  
  const logList = logsSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
        id: doc.id, 
        ...data,
        occurredAt: (data.occurredAt as Timestamp).toDate(),
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

    const logsCol = collection(db, 'audit_logs');
    const docRef = await addDoc(logsCol, newLogData);
    
    return {
        ...newLogData,
        id: docRef.id,
    };
}
