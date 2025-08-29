import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function LocationsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Locations</CardTitle>
          <CardDescription>Manage your warehouses, stores, and other locations.</CardDescription>
        </div>
        <Button>Add Location</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Main Warehouse</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>123 Industrial Ave, Suite 100</TableCell>
              <TableCell><Badge>Active</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Downtown Store</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>456 Main St</TableCell>
              <TableCell><Badge>Active</Badge></TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">Eastside Warehouse</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>789 Distribution Blvd</TableCell>
              <TableCell><Badge>Active</Badge></TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">Westside Pop-up</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Pop-up location, no permanent address</TableCell>
              <TableCell><Badge variant="secondary">Inactive</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
