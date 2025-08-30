
'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { EditProductDialog } from "@/components/products/edit-product-dialog";
import { DeleteProductDialog } from "@/components/products/delete-product-dialog";
import { Button } from '@/components/ui/button';
import { useRole } from "@/hooks/use-role";
import { useEffect, useState, useTransition } from "react";
import type { Product } from "@/lib/types";
import { getProducts } from "@/services/products";
import { getMoreProducts } from '@/app/actions';
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function ProductsPage() {
  const { role, isLoading: isRoleLoading } = useRole();
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const { products: initialProducts, hasMore: initialHasMore } = await getProducts({ limit: 10 });
      setProducts(initialProducts);
      setHasMore(initialHasMore);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const loadMoreProducts = async () => {
    if (!hasMore || isPending) return;

    startTransition(async () => {
        const lastVisibleId = products[products.length - 1]?.id;
        const result = await getMoreProducts(lastVisibleId);
        if (result.success) {
            setProducts(prevProducts => [...prevProducts, ...result.products!]);
            setHasMore(result.hasMore!);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    });
  }

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
                <TableCell>{product.variants?.length ?? 0}</TableCell>
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
      {hasMore && (
        <CardFooter className="justify-center">
            <Button onClick={loadMoreProducts} disabled={isPending}>
                {isPending ? 'Loading...' : 'Load More'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}

    
