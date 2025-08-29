import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function InventoryPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Inventory Levels</CardTitle>
          <CardDescription>An overview of your current stock levels across all locations.</CardDescription>
        </div>
        <Button>Add Manual Adjustment</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>UOM</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">SKU-A1-L</TableCell>
              <TableCell>Lavender (Large)</TableCell>
              <TableCell>Main Warehouse</TableCell>
              <TableCell className="text-right">1,205</TableCell>
              <TableCell>each</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">SKU-R2-S</TableCell>
              <TableCell>Rosemary (Small)</TableCell>
              <TableCell>Downtown Store</TableCell>
              <TableCell className="text-right"><Badge variant="destructive">52</Badge></TableCell>
              <TableCell>each</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">SKU-M3-M</TableCell>
              <TableCell>Mint (Medium)</TableCell>
              <TableCell>Main Warehouse</TableCell>
              <TableCell className="text-right">780</TableCell>
              <TableCell>each</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">SKU-T4-L</TableCell>
              <TableCell>Thyme (Large)</TableCell>
              <TableCell>Eastside Warehouse</TableCell>
              <TableCell className="text-right">450</TableCell>
              <TableCell>each</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">SKU-B5-S</TableCell>
              <TableCell>Basil (Small)</TableCell>
              <TableCell>Downtown Store</TableCell>
              <TableCell className="text-right"><Badge variant="destructive">-10</Badge></TableCell>
              <TableCell>each</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
