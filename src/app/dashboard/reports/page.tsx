'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Database } from 'lucide-react';
import { exportToBigQuery } from '@/app/actions';

export default function ReportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Generate and view reports on your inventory, sales, and more.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-16">
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="text-sm">Advanced reporting and analytics will be available here.</p>
          </div>
        </CardContent>
      </Card>
      
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
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Triggered By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">BigQuery</TableCell>
                        <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                        <TableCell>2023-11-01 10:00 AM</TableCell>
                        <TableCell>user@example.com</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-medium">BigQuery</TableCell>
                        <TableCell><Badge>Completed</Badge></TableCell>
                        <TableCell>2023-10-15 03:45 PM</TableCell>
                        <TableCell>user@example.com</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
