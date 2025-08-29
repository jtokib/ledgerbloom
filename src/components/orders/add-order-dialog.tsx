
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
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/app/actions';
import { useUser } from 'reactfire';

// NOTE: This is a simplified version. A real implementation would
// involve adding line items, selecting products, etc.

export function AddOrderDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: user } = useUser();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.email) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create an order.' });
        return;
    }
    const formData = new FormData(event.currentTarget);
    const result = await createOrder(user.email, formData);

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
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>
              Create a new customer order. Line items can be added later.
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
                required
              />
            </div>
            {/* Add line item management UI here in a real app */}
          </div>
          <DialogFooter>
            <Button type="submit">Save Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
