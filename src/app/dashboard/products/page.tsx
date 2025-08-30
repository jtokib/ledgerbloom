
'use client';
import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { EditProductDialog } from "@/components/products/edit-product-dialog";
import { DeleteProductDialog } from "@/components/products/delete-product-dialog";
import { Button } from '@/components/ui/button';
import { useRole } from "@/hooks/use-role";
import { useEffect, useState, useTransition, useMemo } from "react";
import type { Product } from "@/lib/types";
import { getProducts } from "@/services/products";
import { getMoreProducts } from '@/app/actions';
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ChevronDown, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';


export default function ProductsPage() {
  const { role, isLoading: isRoleLoading } = useRole();
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [openCollapsibles, setOpenCollapsibles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
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

  const toggleCollapsible = (id: string) => {
    setOpenCollapsibles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  }

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

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
        return products;
    }
    return products.filter(product => 
        product.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);


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
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products and their variants.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search"
                placeholder="Search products by name..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {showActions && <AddProductDialog />}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Base UOM</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead className="w-[100px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 7 : 6} className="h-24 text-center">
                  {searchTerm ? "No products match your search." : "No products found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map(product => (
                <Collapsible asChild key={product.id} open={openCollapsibles.has(product.id)} onOpenChange={() => toggleCollapsible(product.id)}>
                  <>
                    <TableRow>
                      <TableCell>
                        {product.variants && product.variants.length > 0 && (
                          <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <ChevronDown className={cn("h-4 w-4 transition-transform", openCollapsibles.has(product.id) && "rotate-180")} />
                              </Button>
                          </CollapsibleTrigger>
                        )}
                      </TableCell>
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
                    <CollapsibleContent asChild>
                      <TableRow>
                          <TableCell colSpan={showActions ? 7 : 6} className="p-0">
                            {product.variants?.length > 0 ? (
                              <div className="p-4 bg-muted/50">
                                  <h4 className="font-semibold text-sm mb-2 ml-2">Variants</h4>
                                  <Table>
                                      <TableHeader>
                                          <TableRow>
                                              <TableHead>SKU</TableHead>
                                              <TableHead>Package Size</TableHead>
                                              <TableHead>UOM</TableHead>
                                              <TableHead>Barcode</TableHead>
                                              <TableHead>Status</TableHead>
                                          </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                          {product.variants?.map(variant => (
                                              <TableRow key={variant.id}>
                                                  <TableCell className="font-mono text-xs">{variant.sku}</TableCell>
                                                  <TableCell>{variant.packageSize}</TableCell>
                                                  <TableCell>{variant.uom}</TableCell>
                                                  <TableCell className="font-mono text-xs">{variant.barcode || 'N/A'}</TableCell>
                                                  <TableCell>
                                                      {variant.active ? <Badge variant="outline">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                                                  </TableCell>
                                              </TableRow>
                                          ))}
                                      </TableBody>
                                  </Table>
                            </div>
                            ) : null}
                          </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {hasMore && !searchTerm && (
        <CardFooter className="justify-center">
            <Button onClick={loadMoreProducts} disabled={isPending}>
                {isPending ? 'Loading...' : 'Load More'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
