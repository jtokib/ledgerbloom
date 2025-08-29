import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAuditLogs } from "@/services/audit";
import { FileText, User, Server } from "lucide-react";

export default async function AuditLogPage() {
  const logs = await getAuditLogs();

  const getActionVariant = (action: string) => {
    if (action.includes('create')) return 'default';
    if (action.includes('update')) return 'secondary';
    if (action.includes('delete')) return 'destructive';
    return 'outline';
  }

  const getIcon = (user: string) => {
    if (user === 'system') {
        return <Server className="h-4 w-4 text-muted-foreground" />;
    }
    return <User className="h-4 w-4 text-muted-foreground" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
        <CardDescription>A detailed history of all activities and changes in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead className="w-[180px]">Actor</TableHead>
              <TableHead className="w-[150px]">Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground">{log.occurredAt.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getIcon(log.user)}
                    <span className="font-medium">{log.user}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{log.details.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
