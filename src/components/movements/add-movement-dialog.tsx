
'use client';
import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createMovement } from '@/app/actions';
import { getProducts } from '@/services/products';
import { getLocations } from '@/services/locations';
import type { Product, Location } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '../ui/skeleton';

type AddMovementDialogProps = {
    children: React.ReactNode;
}

export function AddMovementDialog({ children }: AddMovementDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      async function fetchData() {
        setIsLoading(true);
        const [productsData, locationsData] = await Promise.all([
            getProducts(),
            getLocations(),
        ]);
        setProducts(productsData);
        setLocations(locationsData);
        setIsLoading(false);
      }
      fetchData();
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await createMovement(formData);

    if (result.success) {
      toast({ title: 'Success', description: 'Movement created successfully.' });
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
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Movement</DialogTitle>
            <DialogDescription>
              Log a new inventory transaction. This will immediately affect inventory levels.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {isLoading ? (
                <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </>
            ) : (
                <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">
                    Product
                  </Label>
                  <Select name="sku" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={`${product.variants[0]?.sku}|${product.baseUOM}`}>
                          {product.displayName} {product.variants[0]?.packageSize ? `(${product.variants[0].packageSize})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="locationId" className="text-right">
                    Location
                  </Label>
                  <Select name="locationId" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="qty" className="text-right">
                        Quantity
                    </Label>
                    <Input id="qty" name="qty" type="number" className="col-span-3" required />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Direction</Label>
                    <RadioGroup name="direction" defaultValue="in" className="col-span-3 flex gap-4">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in" id="in" />
                        <Label htmlFor="in">In</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="out" id="out" />
                        <Label htmlFor="out">Out</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cause" className="text-right">
                    Cause
                  </Label>
                  <Select name="cause" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a cause" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                </>
            )}

          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>Create Movement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
