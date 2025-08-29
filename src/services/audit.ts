'use server';
import type { AuditLog } from '@/lib/types';

const mockAuditLogs: AuditLog[] = [
    {
        id: 'audit_1',
        user: 'user@example.com',
        action: 'location.create',
        occurredAt: new Date('2023-10-29T10:00:00Z'),
        details: {
            entityType: 'location',
            entityId: 'westside-popup',
            message: 'Created new location: Westside Pop-up'
        }
    },
    {
        id: 'audit_2',
        user: 'user@example.com',
        action: 'product.update',
        occurredAt: new Date('2023-10-29T10:05:00Z'),
        details: {
            entityType: 'product',
            entityId: 'prod_thyme',
            message: 'Updated product: Thyme (active: false -> true)'
        }
    },
    {
        id: 'audit_3',
        user: 'user@example.com',
        action: 'export.run',
        occurredAt: new Date('2023-10-29T10:10:00Z'),
        details: {
            entityType: 'export',
            entityId: 'export_1',
            message: 'Ran export to BigQuery, 12 records exported.'
        }
    },
    {
        id: 'audit_4',
        user: 'system',
        action: 'inventory.recalculate',
        occurredAt: new Date('2023-10-29T10:15:00Z'),
        details: {
            entityType: 'system',
            entityId: 'system-process-123',
            message: 'Nightly inventory level recalculation completed.'
        }
    },
];

export async function getAuditLogs(): Promise<AuditLog[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAuditLogs.sort((a,b) => b.occurredAt.getTime() - a.occurredAt.getTime());
}
