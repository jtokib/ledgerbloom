'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Database, DownloadCloud } from 'lucide-react';
import { exportToBigQuery } from '@/app/actions';
import { getExportLogs } from '@/services/exports';
import type { ExportLog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [logs, setLogs] = useState<ExportLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchLogs() {
        setIsLoadingLogs(true);
        // This is not ideal in a client component, but for a mock, it's okay.
        // In a real app, this would be a server component or use an API route.
        const fetchedLogs = await getExportLogs();
        setLogs(fetchedLogs);
        setIsLoadingLogs(false);
    }
    fetchLogs();
  }, []);


  const handleExport = async () => {
    setIsExporting(true);
    
    const result = await exportToBigQuery({
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
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Data Exports</CardTitle>
                <CardDescription>Export your inventory and transactional data to external services.</CardDescription>
            </div>
            <Button onClick={handleExport} disabled={isExporting}>
                {isExporting ? 'Exporting...' : <> <Database className="mr-2 h-4 w-4" /> Export to BigQuery </>}
            </Button>
        </CardHeader>
        <CardContent>
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
                    {isLoadingLogs ? (
                        Array.from({length: 3}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                            </TableRow>
                        ))
                    ) : logs.length === 0 ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
