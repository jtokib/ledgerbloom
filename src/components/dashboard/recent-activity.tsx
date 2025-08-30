
'use client';
import type { InventoryMovement, Product, Location } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Package } from "lucide-react";

type RecentActivityProps = {
    movements: InventoryMovement[];
    products: Product[];
    locations: Location[];
}

export function RecentActivity({ movements, products, locations }: RecentActivityProps) {
  
  const getProduct = (sku: string) => {
    return products.find(p => p.variants.some(v => v.sku === sku)) || null;
  };

  const getVariant = (sku: string) => {
    for (const product of products) {
      const variant = product.variants.find(v => v.sku === sku);
      if (variant) return variant;
    }
    return null;
  }
  
  const getLocationName = (locationId: string) => {
    return locations.find(l => l.id === locationId)?.name ?? 'Unknown Location';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>A log of the last 5 inventory changes.</CardDescription>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No recent activity.
          </div>
        ) : (
          <div className="space-y-6">
            {movements.map((movement) => {
              const product = getProduct(movement.sku);
              const variant = getVariant(movement.sku);
              const productName = product ? `${product.displayName} ${variant?.packageSize ? `(${variant.packageSize})` : ''}` : movement.sku;
              const locationName = getLocationName(movement.locationId);
              const actionText = movement.direction === 'in' ? `added to` : `removed from`;
              
              return (
                <div key={movement.id} className="flex items-start gap-4">
                  <Avatar className="h-9 w-9">
                    {product?.imageUrl ? (
                        <AvatarImage src={product.imageUrl} alt={product.displayName} />
                    ) : (
                        <AvatarFallback><Package className="w-5 h-5 text-muted-foreground" /></AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid gap-1 text-sm">
                    <p className="font-medium">
                      {productName}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold">{movement.qty} {movement.uom}</span> {actionText} <span className="font-semibold">{locationName}</span> for {movement.cause}.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(movement.occurredAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
