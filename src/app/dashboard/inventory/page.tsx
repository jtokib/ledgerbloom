import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getInventoryLevels } from "@/services/inventory";
import { getProducts } from "@/services/products";
import { getLocations } from "@/services/locations";
import type { Product, Location } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default async function InventoryPage() {
  const inventoryLevels = await getInventoryLevels();
  const products = await getProducts();
  const locations = await getLocations();

  const getProduct = (sku: string) => {
    return products.find(p => p.variants.some(v => v.sku === sku));
  }

  const getVariant = (sku: string) => {
    for (const product of products) {
      const variant = product.variants.find(v => v.sku === sku);
      if (variant) return variant;
    }
    return null;
  }

  const getLocation = (locationId: string) => {
    return locations.find(l => l.id === locationId);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Inventory Levels</CardTitle>
          <CardDescription>An overview of your current stock levels across all locations.</CardDescription>
        </div>
        <Button disabled>Add Manual Adjustment</Button>
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
            {inventoryLevels.map(level => {
              const product = getProduct(level.sku);
              const variant = getVariant(level.sku);
              const location = getLocation(level.locationId);
              const productName = product ? `${product.displayName} (${variant?.packageSize})` : 'Unknown Product';
              const locationName = location ? location.name : 'Unknown Location';

              return (
                <TableRow key={level.id}>
                  <TableCell className="font-medium">{level.sku}</TableCell>
                  <TableCell>{productName}</TableCell>
                  <TableCell>{locationName}</TableCell>
                  <TableCell className="text-right">
                    {level.qty < 100 ? (
                      <Badge variant={level.qty < 0 ? "destructive" : "secondary"}>{level.qty.toLocaleString()}</Badge>
                    ) : (
                      level.qty.toLocaleString()
                    )}
                  </TableCell>
                  <TableCell>{level.uom}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}