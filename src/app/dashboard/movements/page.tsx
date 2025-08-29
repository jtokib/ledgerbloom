
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getMovements } from "@/services/movements";
import { getProducts } from "@/services/products";
import { getLocations } from "@/services/locations";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default async function MovementsPage() {
  const movements = await getMovements();
  const { products } = await getProducts();
  const { locations } = await getLocations();

  const getProductDisplayName = (sku: string) => {
    for (const product of products) {
      const variant = product.variants.find(v => v.sku === sku);
      if (variant) return `${product.displayName} (${variant.packageSize})`;
    }
    return sku;
  };

  const getLocationName = (locationId: string) => {
    return locations.find(l => l.id === locationId)?.name ?? locationId;
  };

  const causeDisplay: Record<string, { label: string; color?: string }> = {
    purchase: { label: 'Purchase' },
    sale: { label: 'Sale' },
    adjustment: { label: 'Adjustment' },
    transfer: { label: 'Transfer' },
    production: { label: 'Production' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Movements</CardTitle>
        <CardDescription>A complete log of all inventory transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Cause</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map(movement => (
              <TableRow key={movement.id}>
                <TableCell className="text-xs text-muted-foreground">{movement.occurredAt.toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{getProductDisplayName(movement.sku)}</TableCell>
                <TableCell>{getLocationName(movement.locationId)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{causeDisplay[movement.cause]?.label || movement.cause}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono flex items-center justify-end gap-2">
                  {movement.direction === 'in' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-red-500" />
                  )}
                  {movement.qty.toLocaleString()} {movement.uom}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
