import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
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
  );
}
