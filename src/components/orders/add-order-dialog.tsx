
'use client';
import { useState, useEffect, useMemo, useTransition } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createOrder, suggestItemsForOrder } from '@/app/actions';
import { useUser } from 'reactfire';
import { useCustomClaims } from '@/hooks/use-custom-claims';
import type { OrderItem, Product } from '@/lib/types';
import { getProducts } from '@/services/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sparkles, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export function AddOrderDialog() {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, startSubmitTransition] = useTransition();

  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [aiPrompt, setAiPrompt] = useState('');


  const { toast } = useToast();
  const { data: user } = useUser();
  const { claims } = useCustomClaims();

  useEffect(() => {
    if (open) {
      async function fetchProducts() {
        setIsLoading(true);
        const { products } = await getProducts(claims?.organizationId || '', { limit: 1000 });
        setProducts(products);
        setIsLoading(false);
      }
      fetchProducts();
    } else {
        // Reset state on close
        setCustomerName('');
        setItems([]);
        setSelectedVariantId('');
        setQuantity(1);
        setAiPrompt('');
    }
  }, [open]);

  const allVariants = useMemo(() => {
    return products.flatMap(p => p.variants.map(v => ({...v, productName: p.displayName})));
  }, [products]);
  
  const handleAddItem = () => {
    const variant = allVariants.find(v => v.id === selectedVariantId);
    if (!variant || quantity <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Item', description: 'Please select a valid product and quantity.' });
        return;
    }
    // Check if item already exists
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
    // Reset inputs
    setSelectedVariantId('');
    setQuantity(1);
  };
  
  const removeItem = (variantId: string) => {
    setItems(items.filter(item => item.variantId !== variantId));
  };

  const handleGenerateItems = async () => {
    if (!aiPrompt || !claims?.organizationId) return;
    setIsAiLoading(true);
    const result = await suggestItemsForOrder({
      organizationId: claims.organizationId,
      description: aiPrompt
    });
    setIsAiLoading(false);

    if (result.success && result.items) {
        const newItems: OrderItem[] = result.items.map(suggestedItem => {
            const variant = allVariants.find(v => v.sku === suggestedItem.sku);
            if (!variant) return null;
            return {
                variantId: variant.id,
                sku: variant.sku,
                name: `${variant.productName} (${variant.packageSize})`,
                price: variant.price,
                quantity: suggestedItem.quantity
            };
        }).filter((item): item is OrderItem => item !== null);

        // Merge with existing items
        const updatedItems = [...items];
        newItems.forEach(newItem => {
            const existingIndex = updatedItems.findIndex(i => i.variantId === newItem.variantId);
            if (existingIndex > -1) {
                updatedItems[existingIndex].quantity += newItem.quantity;
            } else {
                updatedItems.push(newItem);
            }
        });
        setItems(updatedItems);
        toast({ title: 'Success', description: `${newItems.length} item(s) added to the order.`});
    } else {
        toast({ variant: 'destructive', title: 'AI Suggestion Failed', description: result.error });
    }
  }


  const totalValue = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [items]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startSubmitTransition(async () => {
        if (!user?.email || !claims?.organizationId) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create an order.' });
            return;
        }
        if (!customerName) {
            toast({ variant: 'destructive', title: 'Error', description: 'Customer name is required.' });
            return;
        }
        if (items.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Order must have at least one item.' });
            return;
        }

        const formData = new FormData();
        formData.append('customerName', customerName);
        formData.append('items', JSON.stringify(items));
        
        const result = await createOrder(user.email, claims.organizationId, formData);

        if (result.success) {
        toast({ title: 'Success', description: 'Order created successfully.' });
        setOpen(false);
        } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
        });
        }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>
              Build a new customer order. Use the AI assistant or add items manually.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
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

             <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
                <h4 className="font-medium flex items-center gap-2"><Sparkles className="text-primary"/> AI Assistant</h4>
                 <div className="grid gap-2">
                    <Label htmlFor="ai-prompt">Describe the order</Label>
                    <Textarea
                        id="ai-prompt"
                        placeholder="e.g., 'a starter kit for the bee mix and two refill kits for the california mix...'"
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                    />
                 </div>
                <Button type="button" onClick={handleGenerateItems} disabled={!aiPrompt || isAiLoading}>
                    {isAiLoading ? "Generating..." : "Generate Items"}
                </Button>
            </div>
            
            <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium">Manual Entry</h4>
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
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.variantId)}>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
