
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
import { deleteUser } from '@/app/actions';
import { Trash2 } from 'lucide-react';
import { useUser } from 'reactfire';
import { useCustomClaims } from '@/hooks/use-custom-claims';
import type { User as AppUser } from '@/lib/types';

interface DeleteMemberDialogProps {
    member: AppUser;
    disabled?: boolean;
}

export function DeleteMemberDialog({ member, disabled }: DeleteMemberDialogProps) {
  const { toast } = useToast();
  const { data: user } = useUser();
  const { claims } = useCustomClaims();

  async function handleDelete() {
    if (!user?.email || !claims?.organizationId) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to remove a member.' });
        return;
    }
    if (user.uid === member.id) {
        toast({ variant: 'destructive', title: 'Error', description: 'You cannot remove yourself.' });
        return;
    }

    const result = await deleteUser(user.email, claims.organizationId, member.id, member.email);

    if (result.success) {
      toast({ title: 'Success', description: 'Member removed successfully.' });
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
        <Button variant="ghost" size="icon" disabled={disabled}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently remove <span className="font-bold">{member.displayName || member.email}</span> from your organization. They will immediately lose all access. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Remove Member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
