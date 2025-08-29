
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddLocationDialog } from "@/components/locations/add-location-dialog";
import { EditLocationDialog } from "@/components/locations/edit-location-dialog";
import { DeleteLocationDialog } from "@/components/locations/delete-location-dialog";
import { useRole } from "@/hooks/use-role";
import { useEffect, useState } from "react";
import type { Location } from "@/lib/types";
import { getLocations } from "@/services/locations";
import { Skeleton } from "@/components/ui/skeleton";

export default function LocationsPage() {
  const { role, isLoading: isRoleLoading } = useRole();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const locationsData = await getLocations();
      setLocations(locationsData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const showActions = role === 'admin';

  if (isLoading || isRoleLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Locations</CardTitle>
          <CardDescription>Manage your warehouses, stores, and other locations.</CardDescription>
        </div>
        {showActions && <AddLocationDialog />}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead className="w-[100px] text-right">Actions</TableHead>}
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
                {showActions && (
                    <TableCell className="text-right">
                        <EditLocationDialog location={location} />
                        <DeleteLocationDialog locationId={location.id} />
                    </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
