
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AddMovementDialog } from '@/components/movements/add-movement-dialog';
import { getInventoryLevels } from '@/services/inventory';
import { getLocations } from '@/services/locations';
import { getMovements } from '@/services/movements';
import { subDays, format, startOfDay, eachDayOfInterval } from 'date-fns';
import { DashboardChart } from '@/components/dashboard/dashboard-chart';

export default async function Dashboard() {
  const inventoryLevels = await getInventoryLevels();
  const { locations } = await getLocations();
  const { movements } = await getMovements({ limit: 1000 }); // Fetch more for chart

  // This is a placeholder calculation. A real app would use product cost.
  const totalInventoryValue = inventoryLevels.reduce((acc, level) => acc + (level.qty * 10), 0); 
  const lowStockItems = inventoryLevels.filter(level => level.qty > 0 && level.qty < 10).length;
  const criticallyLowStockItems = inventoryLevels.filter(level => level.qty <= 0).length;
  
  const oneDayAgo = subDays(new Date(), 1);
  const recentMovementsCount = movements.filter(m => m.occurredAt > oneDayAgo).length;
  const activeLocations = locations.filter(l => l.active).length;
  const warehouseCount = locations.filter(l => l.type === 'warehouse' && l.active).length;
  const storeCount = locations.filter(l => l.type === 'store' && l.active).length;

  // --- Chart Data Calculation ---
  const thirtyDaysAgo = subDays(new Date(), 29);
  const today = new Date();
  const dateInterval = eachDayOfInterval({ start: thirtyDaysAgo, end: today });

  const dailyDataMap = new Map<string, { date: string; sales: number; purchases: number }>();
  dateInterval.forEach(day => {
    const formattedDate = format(day, 'MMM d');
    dailyDataMap.set(formattedDate, { date: formattedDate, sales: 0, purchases: 0 });
  });

  movements
    .filter(m => m.occurredAt >= thirtyDaysAgo)
    .forEach(movement => {
      const formattedDate = format(movement.occurredAt, 'MMM d');
      const dayData = dailyDataMap.get(formattedDate);
      if (dayData) {
        if (movement.cause === 'sale') {
          dayData.sales += movement.qty;
        } else if (movement.cause === 'purchase') {
          dayData.purchases += movement.qty;
        }
      }
    });
  
  const chartData = Array.from(dailyDataMap.values());
  // --- End Chart Data Calculation ---

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
            <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
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
            <div className="text-2xl font-bold">+{recentMovementsCount}</div>
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
      <DashboardChart data={chartData} />
    </div>
  );
}
