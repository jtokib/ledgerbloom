
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMovements } from "@/services/movements";
import { getProducts } from "@/services/products";
import { getLocations } from "@/services/locations";
import { getMoreMovements } from '@/app/actions';
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import type { InventoryMovement, Product, Location } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovementsPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const [
        { movements: initialMovements, hasMore: initialHasMore },
        { products: productsData },
        { locations: locationsData }
      ] = await Promise.all([
        getMovements({ limit: 20 }),
        getProducts({ limit: 500 }), // Fetch all products/locations for mapping
        getLocations({ limit: 500 })
      ]);
      
      setMovements(initialMovements);
      setHasMore(initialHasMore);
      setProducts(productsData);
      setLocations(locationsData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const loadMoreMovements = async () => {
    if (!hasMore || isPending) return;

    startTransition(async () => {
        const lastVisibleId = movements[movements.length - 1]?.id;
        const result = await getMoreMovements(lastVisibleId);
        if (result.success) {
            setMovements(prevMovements => [...prevMovements, ...result.movements!]);
            setHasMore(result.hasMore!);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    });
  }

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

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
      {hasMore && (
        <CardFooter className="justify-center">
            <Button onClick={loadMoreMovements} disabled={isPending}>
                {isPending ? 'Loading...' : 'Load More'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
