import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getLocations } from "@/services/locations";
import { AddLocationDialog } from "@/components/locations/add-location-dialog";
import { EditLocationDialog } from "@/components/locations/edit-location-dialog";
import { DeleteLocationDialog } from "@/components/locations/delete-location-dialog";

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Locations</CardTitle>
          <CardDescription>Manage your warehouses, stores, and other locations.</CardDescription>
        </div>
        <AddLocationDialog />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map(location => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.type.charAt(0).toUpperCase() + location.type.slice(1)}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>
                  {location.active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                </TableCell>
                <TableCell className="text-right">
                    <EditLocationDialog location={location} />
                    <DeleteLocationDialog locationId={location.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
