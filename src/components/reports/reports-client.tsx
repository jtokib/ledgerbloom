
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Database, DownloadCloud } from 'lucide-react';
import { exportToBigQuery } from '@/app/actions';
import { getExportLogs } from '@/services/exports';
import type { ExportLog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from 'reactfire';
import { useCustomClaims } from '@/hooks/use-custom-claims';

export function ReportsClient({ initialLogs }: { initialLogs: ExportLog[] }) {
  const [isExporting, setIsExporting] = useState(false);
  const [logs, setLogs] = useState<ExportLog[]>(initialLogs);
  const { data: user } = useUser();
  const { claims } = useCustomClaims();
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);

    if (!user?.email || !claims?.organizationId) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to export data.' });
        setIsExporting(false);
        return;
    }
    
    const result = await exportToBigQuery(user.email, claims.organizationId, {
        datasetId: "ledgerbloom_data",
        inventoryTableId: "inventory_levels",
        movementsTableId: "inventory_movements"
    });
    
    setIsExporting(false);

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
      // Refresh logs
      const fetchedLogs = await getExportLogs();
      setLogs(fetchedLogs);

    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  };

  const getStatusVariant = (status: ExportLog['status']) => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Failed': return 'destructive';
        case 'Pending': return 'secondary';
        default: return 'outline';
    }
  }

  return (
    <>
    <div className="flex justify-end mb-4">
        <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : <> <Database className="mr-2 h-4 w-4" /> Export to BigQuery </>}
        </Button>
    </div>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Triggered By</TableHead>
                <TableHead className="text-right">Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {logs.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No export logs found.
                    </TableCell>
                </TableRow>
            ) : (
                logs.map(log => (
                    <TableRow key={log.id}>
                        <TableCell className="text-xs text-muted-foreground">{log.triggeredAt.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{log.destination}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(log.status)}>{log.status}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {`Inv: ${log.recordCount.inventory}, Mov: ${log.recordCount.movements}`}
                        </TableCell>
                        <TableCell>{log.triggeredBy}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" disabled={log.status !== 'Completed'}>
                                <DownloadCloud className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))
            )}
        </TableBody>
    </Table>
    </>
  );
}
