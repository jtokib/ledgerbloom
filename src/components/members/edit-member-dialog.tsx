
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateUserRole } from '@/app/actions';
import { useUser } from 'reactfire';
import { useCustomClaims } from '@/hooks/use-custom-claims';
import type { User as AppUser } from '@/lib/types';
import { Pencil } from 'lucide-react';

interface EditMemberDialogProps {
    member: AppUser;
    disabled?: boolean;
}

export function EditMemberDialog({ member, disabled }: EditMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<AppUser['role']>(member.role);
  const { toast } = useToast();
  const { data: user } = useUser();
  const { claims } = useCustomClaims();

  async function handleSubmit() {
    if (!user?.email || !claims?.organizationId) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update a member.' });
        return;
    }
    if (user.uid === member.id) {
        toast({ variant: 'destructive', title: 'Error', description: 'You cannot change your own role.' });
        return;
    }

    const result = await updateUserRole(user.email, claims.organizationId, member.id, member.email, role);

    if (result.success) {
      toast({ title: 'Success', description: result.message });
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
        <Button variant="ghost" size="icon" disabled={disabled}>
            <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Member: {member.displayName}</DialogTitle>
            <DialogDescription>
              Change the role for {member.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select name="role" value={role} onValueChange={(value) => setRole(value as AppUser['role'])}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
