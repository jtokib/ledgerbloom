
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import { useEffect, useState, useTransition } from "react";
import type { Order } from "@/lib/types";
import { getOrders } from "@/services/orders";
import { getMoreOrders } from '@/app/actions';
import { Skeleton } from "@/components/ui/skeleton";
import { AddOrderDialog } from "@/components/orders/add-order-dialog";
import { EditOrderDialog } from "@/components/orders/edit-order-dialog";
import { useToast } from "@/hooks/use-toast";

export default function OrdersPage() {
  const { role, isLoading: isRoleLoading } = useRole();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const { orders: initialOrders, hasMore: initialHasMore } = await getOrders({ limit: 10 });
      setOrders(initialOrders);
      setHasMore(initialHasMore);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const loadMoreOrders = async () => {
    if (!hasMore || isPending) return;

    startTransition(async () => {
        const lastVisibleId = orders[orders.length - 1]?.id;
        const result = await getMoreOrders(lastVisibleId);
        if (result.success) {
            setOrders(prevOrders => [...prevOrders, ...result.orders!]);
            setHasMore(result.hasMore!);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    });
  }

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'outline';
      case 'processing': return 'secondary';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  }

  const getStatusColor = (status: Order['status']) => {
     switch (status) {
      case 'pending': return '';
      case 'processing': return '';
      case 'shipped': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return '';
      default: return '';
    }
  }

  const canManageOrders = role === 'admin' || role === 'manager';

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
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage and track customer orders.</CardDescription>
        </div>
        {canManageOrders && <AddOrderDialog />}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              {canManageOrders && <TableHead className="w-[100px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)} className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {`$${order.totalValue.toFixed(2)}`}
                </TableCell>
                {canManageOrders && (
                  <TableCell className="text-right">
                    <EditOrderDialog order={order} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
       {hasMore && (
        <CardFooter className="justify-center">
            <Button onClick={loadMoreOrders} disabled={isPending}>
                {isPending ? 'Loading...' : 'Load More'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
