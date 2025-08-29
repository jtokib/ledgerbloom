
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { AddMovementDialog } from '@/components/movements/add-movement-dialog';
import { getInventoryLevels } from '@/services/inventory';
import { getLocations } from '@/services/locations';
import { getMovements } from '@/services/movements';
import { subDays } from 'date-fns';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Purchases',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default async function Dashboard() {
  const inventoryLevels = await getInventoryLevels();
  const locations = await getLocations();
  const movements = await getMovements();

  // This is a placeholder calculation. A real app would use product cost.
  const totalInventoryValue = inventoryLevels.reduce((acc, level) => acc + (level.qty * 10), 0); 
  const lowStockItems = inventoryLevels.filter(level => level.qty > 0 && level.qty < 10).length;
  const criticallyLowStockItems = inventoryLevels.filter(level => level.qty <= 0).length;
  
  const oneDayAgo = subDays(new Date(), 1);
  const recentMovements = movements.filter(m => m.occurredAt > oneDayAgo).length;
  const activeLocations = locations.filter(l => l.active).length;
  const warehouseCount = locations.filter(l => l.type === 'warehouse' && l.active).length;
  const storeCount = locations.filter(l => l.type === 'store' && l.active).length;


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold tracking-tight">
          Welcome back!
        </h1>
        <AddMovementDialog>
            <Button>Create Movement</Button>
        </AddMovementDialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <span className="text-2xl">🌿</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            <p className="text-xs text-muted-foreground">
              Based on placeholder values
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <span className="text-2xl">⚠️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              {criticallyLowStockItems} items critically low
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Movements</CardTitle>
            <span className="text-2xl">🚚</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{recentMovements}</div>
            <p className="text-xs text-muted-foreground">
              in the last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            <span className="text-2xl">📍</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeLocations}</div>
            <p className="text-xs text-muted-foreground">
              {warehouseCount} warehouses, {storeCount} stores
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales & Purchases Overview</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="text-muted-foreground">
              Showing total sales and purchases for the last 6 months.
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
