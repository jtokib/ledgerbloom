
'use client';
import { useState, useTransition } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createLocation } from '@/app/actions';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser } from 'reactfire';

const locationSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    address: z.string().optional(),
    type: z.enum(['warehouse', 'store', 'supplier'], {
      required_error: "You need to select a location type.",
    }),
    active: z.boolean().default(true),
});

type LocationFormValues = z.infer<typeof locationSchema>;

export function AddLocationDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { data: user } = useUser();

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
        name: '',
        address: '',
        active: true,
    }
  });

  async function onSubmit(data: LocationFormValues) {
    if (!user?.email) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create a location.' });
        return;
    }
    startTransition(async () => {
        const result = await createLocation(user.email, data);
        if (result.success) {
            toast({ title: 'Success', description: 'Location created successfully.' });
            setOpen(false);
            form.reset();
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
        <Button>Add Location</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Add Location</DialogTitle>
                <DialogDescription>
                Add a new warehouse, store, or other location to your organization.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Main Warehouse" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Blossom St" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="warehouse">Warehouse</SelectItem>
                                <SelectItem value="store">Store</SelectItem>
                                <SelectItem value="supplier">Supplier</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Active</FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Location"}
                </Button>
            </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
