
'use server';
import type { ExportLog } from '@/lib/types';
import { getInventoryLevels } from './inventory';
import { getMovements } from './movements';

let mockExportLogs: ExportLog[] = [
    {
        id: 'export_1',
        destination: 'BigQuery',
        status: 'Completed',
        triggeredBy: 'user@example.com',
        triggeredAt: new Date('2023-10-15T15:45:00Z'),
        recordCount: {
            inventory: 5,
            movements: 7
        },
        message: 'Data export to BigQuery completed successfully.'
    }
];

export async function getExportLogs(): Promise<ExportLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockExportLogs.sort((a,b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
}

export async function createExportLog(logData: Omit<ExportLog, 'id' | 'triggeredAt' | 'recordCount'>): Promise<ExportLog> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app we wouldn't fetch this data twice, but for the mock it's okay.
    const inventory = await getInventoryLevels();
    const movements = await getMovements();

    const newLog: ExportLog = {
        ...logData,
        id: `export_${Date.now()}`,
        triggeredAt: new Date(),
        recordCount: {
            inventory: inventory.length,
            movements: movements.length
        }
    };
    mockExportLogs.push(newLog);
    return newLog;
}
