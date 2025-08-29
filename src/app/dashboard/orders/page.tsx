
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { getOrders } from "@/services/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { AddOrderDialog } from "@/components/orders/add-order-dialog";
import { EditOrderDialog } from "@/components/orders/edit-order-dialog";

export default function OrdersPage() {
  const { role, isLoading: isRoleLoading } = useRole();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const ordersData = await getOrders();
      setOrders(ordersData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

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
                <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
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
    </Card>
  );
}
