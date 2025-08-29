
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useUser } from "reactfire";
import { updateUserProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

export default function SettingsPage() {
  const { data: user } = useUser();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.email) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to update your profile." });
      return;
    }
    const formData = new FormData(event.currentTarget);
    const result = await updateUserProfile(user.email, formData);

    if (result.success) {
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };


  return (
    <Tabs defaultValue="profile" className="grid gap-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">My Profile</TabsTrigger>
        <TabsTrigger value="organization">Organization</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <Card>
          <form ref={formRef} onSubmit={handleProfileSubmit}>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user?.displayName ?? ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email ?? ''} disabled />
              </div>
              <Button type="submit">Save Changes</Button>
            </CardContent>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="organization">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Manage your organization's settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" defaultValue="Mr. Bloom Inc." disabled />
            </div>
             <div className="space-y-2">
              <Label>Plan</Label>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-primary">Pro Plan</p>
                <Button variant="outline" disabled>Upgrade Plan</Button>
              </div>
            </div>
            <Button disabled>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="members">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>Manage your organization's members and their roles.</CardDescription>
            </div>
            <Button disabled>Invite Member</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{user?.displayName ?? 'Bloom User'}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell><Badge variant="outline">Admin</Badge></TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

    