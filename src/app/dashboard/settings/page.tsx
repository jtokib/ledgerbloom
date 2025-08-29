import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <Tabs defaultValue="members" className="grid gap-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">My Profile</TabsTrigger>
        <TabsTrigger value="organization">Organization</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Bloom User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
            <Button disabled>Save Changes</Button>
          </CardContent>
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
              <Input id="org-name" defaultValue="Mr. Bloom Inc." />
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
                  <TableCell className="font-medium">Bloom User</TableCell>
                  <TableCell>user@example.com</TableCell>
                  <TableCell><Badge variant="outline">Admin</Badge></TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Jane Doe</TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell><Badge variant="secondary">Manager</Badge></TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">John Smith</TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell><Badge variant="secondary">Viewer</Badge></TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell className="font-medium">-</TableCell>
                  <TableCell>new.user@example.com</TableCell>
                  <TableCell><Badge variant="secondary">Viewer</Badge></TableCell>
                  <TableCell><Badge variant="destructive">Pending</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
