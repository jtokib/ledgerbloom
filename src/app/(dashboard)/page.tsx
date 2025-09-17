import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a summary of your inventory.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,257</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              Items are below reorder point
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>An overview of your most recent orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
                  </TableCell>
                  <TableCell><Badge>Fulfilled</Badge></TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Olivia Smith</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">olivia@example.com</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Noah Williams</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">noah@example.com</div>
                  </TableCell>
                  <TableCell><Badge>Fulfilled</Badge></TableCell>
                  <TableCell className="text-right">$350.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A log of recent inventory movements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">50 units of "California Poppy Seeds" added.</p>
                    <p className="text-sm text-muted-foreground">Reason: Purchase</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">5m ago</div>
            </div>
            <div className="flex items-center">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Kit "Native Mix" exploded for Order #1121</p>
                    <p className="text-sm text-muted-foreground">Reason: Sale</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">1h ago</div>
            </div>
            <div className="flex items-center">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Stock adjustment for "Lupine Seeds".</p>
                    <p className="text-sm text-muted-foreground">-5 units</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">3h ago</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
