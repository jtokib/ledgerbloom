
'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { EditProductDialog } from "@/components/products/edit-product-dialog";
import { DeleteProductDialog } from "@/components/products/delete-product-dialog";
import { useRole } from "@/hooks/use-role";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { getProducts } from "@/services/products";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from 'lucide-react';


export default function ProductsPage() {
  const { role, isLoading: isRoleLoading } = useRole();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const productsData = await getProducts();
      setProducts(productsData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const showActions = role === 'admin';

  if (isLoading || isRoleLoading) {
    return (
       <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products and their variants.</CardDescription>
        </div>
        {showActions && <AddProductDialog />}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Base UOM</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead className="w-[100px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.displayName}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.displayName}</TableCell>
                <TableCell>{product.baseUOM}</TableCell>
                <TableCell>{product.variants.length}</TableCell>
                <TableCell>
                  {product.active ? <Badge>Active</Badge> : <Badge variant="secondary">Archived</Badge>}
                </TableCell>
                 {showActions && (
                    <TableCell className="text-right">
                        <EditProductDialog product={product} />
                        <DeleteProductDialog productId={product.id} />
                    </TableCell>
                 )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
