
'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateOrder } from '@/app/actions';
import { Pencil, Trash2 } from 'lucide-react';
import type { Order, OrderItem, Product } from '@/lib/types';
import { useUser } from 'reactfire';
import { getProducts } from '@/services/products';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function EditOrderDialog({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState(order.customerName);
  const [status, setStatus] = useState(order.status);
  const [items, setItems] = useState<OrderItem[]>(order.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { toast } = useToast();
  const { data: user } = useUser();

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setCustomerName(order.customerName);
      setStatus(order.status);
      setItems(order.items);
      setSelectedVariantId('');
      setQuantity(1);

      async function fetchProducts() {
        setIsLoading(true);
        const { products } = await getProducts({ limit: 1000 });
        setProducts(products);
        setIsLoading(false);
      }
      fetchProducts();
    }
  }, [open, order]);
  
  const allVariants = useMemo(() => {
    return products.flatMap(p => p.variants.map(v => ({...v, productName: p.displayName})));
  }, [products]);

  const handleAddItem = () => {
    const variant = allVariants.find(v => v.id === selectedVariantId);
    if (!variant || quantity <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Item', description: 'Please select a valid product and quantity.' });
        return;
    }
    const existingItemIndex = items.findIndex(item => item.variantId === variant.id);
    if (existingItemIndex > -1) {
        const newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
        setItems(newItems);
    } else {
        setItems([...items, {
            variantId: variant.id,
            sku: variant.sku,
            name: `${variant.productName} (${variant.packageSize})`,
            price: variant.price,
            quantity: quantity,
        }]);
    }
    setSelectedVariantId('');
    setQuantity(1);
  };
  
  const removeItem = (variantId: string) => {
    setItems(items.filter(item => item.variantId !== variantId));
  };
  
  const totalValue = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [items]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.email) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update an order.' });
        return;
    }

    const formData = new FormData();
    formData.append('id', order.id);
    formData.append('customerName', customerName);
    formData.append('status', status);
    formData.append('items', JSON.stringify(items));

    const result = await updateOrder(user.email, formData);

    if (result.success) {
      toast({ title: 'Success', description: 'Order updated successfully.' });
      setOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Order {order.orderNumber}</DialogTitle>
            <DialogDescription>
              Update the details of this order.
            </DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName" className="text-right">
                Customer
              </Label>
              <Input
                id="customerName"
                name="customerName"
                className="col-span-3"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" value={status} onValueChange={(v) => setStatus(v as Order['status'])} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium">Add Line Item</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select value={selectedVariantId} onValueChange={setSelectedVariantId} disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a product..." />
                        </SelectTrigger>
                        <SelectContent>
                            {allVariants.map(v => (
                                <SelectItem key={v.id} value={v.id}>
                                    {v.productName} ({v.packageSize}) - ${v.price.toFixed(2)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        placeholder="Qty"
                        value={quantity}
                        onChange={e => setQuantity(parseInt(e.target.value, 10))}
                        min="1"
                    />
                    <Button type="button" onClick={handleAddItem} disabled={!selectedVariantId || quantity <= 0}>Add Item</Button>
                </div>
            </div>

             {items.length > 0 && (
                <div className="space-y-2">
                    <Label>Order Items</Label>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(item => (
                                <TableRow key={item.variantId}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.variantId)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     <div className="text-right font-bold text-lg">
                        Total: ${totalValue.toFixed(2)}
                    </div>
                </div>
            )}

          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
