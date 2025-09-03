
'use client';
import { useState, useEffect } from 'react';
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
import type { Product, Variant } from '@/lib/types';
import { Pencil, Package, Trash2, PlusCircle } from 'lucide-react';
import { useUser } from 'reactfire';
import { useCustomClaims } from '@/hooks/use-custom-claims';
import { Separator } from '../ui/separator';

export function EditProductDialog({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [variants, setVariants] = useState<Partial<Variant>[]>([]);
  const { toast } = useToast();
  const { data: user } = useUser();
  const { claims } = useCustomClaims();

  useEffect(() => {
    if (open) {
      setVariants(product.variants || []);
    }
  }, [open, product.variants]);

  const handleVariantChange = (index: number, field: keyof Variant, value: string | boolean | number) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, {
      id: `new_${Date.now()}`,
      sku: '',
      packageSize: '',
      uom: product.baseUOM,
      active: true,
      barcode: '',
      price: 0
    }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.email || !claims?.organizationId) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update a product.' });
      return;
    }
    const formData = new FormData(event.currentTarget);
    formData.append('variants', JSON.stringify(variants));

    const result = await updateProduct(user.email, claims.organizationId, formData);

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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details and manage variants for this product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Product Details Column */}
            <div className="space-y-4">
              <input type="hidden" name="id" value={product.id} />
              <div>
                <Label htmlFor="displayName">Product Name</Label>
                <Input id="displayName" name="displayName" defaultValue={product.displayName} required />
              </div>
              <div>
                <Label htmlFor="baseUOM">Base UOM</Label>
                <Input id="baseUOM" name="baseUOM" defaultValue={product.baseUOM} required />
              </div>
              <div>
                <Label htmlFor="image">Image</Label>
                <div className="flex items-center gap-4">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.displayName} width={60} height={60} className="rounded-md object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <Input id="image" name="image" type="file" accept="image/*" />
                    <p className="text-xs text-muted-foreground mt-1">Leave blank to keep current image.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="active" name="active" defaultChecked={product.active} />
                <Label htmlFor="active">Product Active</Label>
              </div>
            </div>

            {/* Variants Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Variants</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Variant
                  </Button>
              </div>
              <Separator />
              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={variant.id || index} className="p-4 border rounded-lg space-y-4 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor={`sku-${index}`}>SKU</Label>
                            <Input id={`sku-${index}`} value={variant.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor={`packageSize-${index}`}>Package Size</Label>
                            <Input id={`packageSize-${index}`} value={variant.packageSize} onChange={(e) => handleVariantChange(index, 'packageSize', e.target.value)} required />
                        </div>
                         <div>
                            <Label htmlFor={`uom-${index}`}>UOM</Label>
                            <Input id={`uom-${index}`} value={variant.uom} onChange={(e) => handleVariantChange(index, 'uom', e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor={`price-${index}`}>Price</Label>
                            <Input id={`price-${index}`} type="number" step="0.01" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.valueAsNumber)} required />
                        </div>
                        <div>
                            <Label htmlFor={`barcode-${index}`}>Barcode</Label>
                            <Input id={`barcode-${index}`} value={variant.barcode || ''} onChange={(e) => handleVariantChange(index, 'barcode', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Switch id={`active-${index}`} checked={variant.active} onCheckedChange={(checked) => handleVariantChange(index, 'active', checked)} />
                            <Label htmlFor={`active-${index}`}>Variant Active</Label>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeVariant(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
                 {variants.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No variants defined. Add one to get started.</p>
                )}
              </div>
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
