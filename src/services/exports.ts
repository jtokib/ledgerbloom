
'use server';
import type { ExportLog } from '@/lib/types';
import { getInventoryLevels } from './inventory';
import { getMovements } from './movements';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';


export async function getExportLogs(): Promise<ExportLog[]> {
    const logsCol = collection(db, 'export_logs');
    const q = query(logsCol, orderBy('triggeredAt', 'desc'));
    const logsSnapshot = await getDocs(q);

    const logList = logsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            triggeredAt: (data.triggeredAt as Timestamp).toDate(),
        } as ExportLog
    });

    return logList;
}

export async function createExportLog(logData: Omit<ExportLog, 'id' | 'triggeredAt' | 'recordCount'>): Promise<ExportLog> {
    // In a real app we wouldn't fetch this data twice, but for the mock it's okay for now.
    const inventory = await getInventoryLevels('temp-org-id'); // TODO: Get from context
    const movements = await getMovements('temp-org-id'); // TODO: Get from context

    const newLogData = {
        ...logData,
        triggeredAt: new Date(),
        recordCount: {
            inventory: inventory.length,
            movements: movements.movements.length
        }
    };
    
    const logsCol = collection(db, 'export_logs');
    const docRef = await addDoc(logsCol, newLogData);
    
    return {
        ...newLogData,
        id: docRef.id,
    };
}
