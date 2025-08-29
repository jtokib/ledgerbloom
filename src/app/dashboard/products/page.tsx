import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products and their variants.</CardDescription>
        </div>
        <Button>Add Product</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Base UOM</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Lavender</TableCell>
              <TableCell>each</TableCell>
              <TableCell>3</TableCell>
              <TableCell><Badge>Active</Badge></TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">Rosemary</TableCell>
              <TableCell>each</TableCell>
              <TableCell>2</TableCell>
              <TableCell><Badge>Active</Badge></TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">Mint</TableCell>
              <TableCell>each</TableCell>
              <TableCell>2</TableCell>
              <TableCell><Badge>Active</Badge></TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">Thyme</TableCell>
              <TableCell>each</TableCell>
              <TableCell>1</TableCell>
              <TableCell><Badge variant="secondary">Archived</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
