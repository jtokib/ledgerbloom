
'use client';
import { useState } from 'react';
import Image from 'next/image';
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
import { updateProduct } from '@/app/actions';
import type { Product } from '@/lib/types';
import { Pencil, Package } from 'lucide-react';

export function EditProductDialog({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await updateProduct(formData);

    if (result.success) {
      toast({ title: 'Success', description: 'Product updated successfully.' });
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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for this product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="id" value={product.id} />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Name
              </Label>
              <Input
                id="displayName"
                name="displayName"
                className="col-span-3"
                defaultValue={product.displayName}
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
                defaultValue={product.baseUOM}
                required
              />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="image" className="text-right pt-2">
                Image
              </Label>
              <div className="col-span-3 flex flex-col gap-2">
                {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.displayName}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                <Input
                  id="image"
                  name="image"
                  type="file"
                  className="col-span-3"
                  accept="image/*"
                />
                 <p className="text-xs text-muted-foreground">Leave blank to keep current image.</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <Switch id="active" name="active" defaultChecked={product.active} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
