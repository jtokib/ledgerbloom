
import { getExportLogs } from '@/services/exports';
import { ReportsClient } from '@/components/reports/reports-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function ReportsPage() {
  const initialLogs = await getExportLogs();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Exports</CardTitle>
          <CardDescription>Export your inventory and transactional data to external services.</CardDescription>
        </CardHeader>
        <CardContent>
            <ReportsClient initialLogs={initialLogs} />
        </CardContent>
      </Card>
    </div>
  );
}
