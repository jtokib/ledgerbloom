
'use client';
import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createProduct } from '@/app/actions';
import { useUser } from 'reactfire';

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: user } = useUser();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.email) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create a product.' });
        return;
    }
    const formData = new FormData(event.currentTarget);
    const result = await createProduct(user.email, formData);

    if (result.success) {
      toast({ title: 'Success', description: 'Product created successfully.' });
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
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Add a new product to your catalog. You can add variants later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Name
              </Label>
              <Input
                id="displayName"
                name="displayName"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseUOM" className="text-right">
                Base UOM
              </Label>
              <Input
                id="baseUOM"
                name="baseUOM"
                className="col-span-3"
                placeholder="e.g., each, lb, kg"
                required
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                Initial SKU
              </Label>
              <Input
                id="sku"
                name="sku"
                className="col-span-3"
                placeholder="e.g., PN-12345"
                required
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                className="col-span-3"
                placeholder="e.g., 19.99"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                className="col-span-3"
                accept="image/*"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <Switch id="active" name="active" defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
