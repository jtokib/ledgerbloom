
'use client';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteLocation } from '@/app/actions';
import { Trash2 } from 'lucide-react';
import { useUser } from 'reactfire';
import { useCustomClaims } from '@/hooks/use-custom-claims';

export function DeleteLocationDialog({ locationId }: { locationId: string }) {
  const { toast } = useToast();
  const { data: user } = useUser();
  const { claims } = useCustomClaims();

  async function handleDelete() {
    if (!user?.email || !claims?.organizationId) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to delete a location.' });
        return;
    }
    const result = await deleteLocation(user.email, claims.organizationId, locationId);

    if (result.success) {
      toast({ title: 'Success', description: 'Location deleted successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this location and all of its associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
