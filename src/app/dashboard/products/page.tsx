import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/services/products";
import { Pencil, Trash2 } from "lucide-react";
import { AddProductDialog } from "@/components/products/add-product-dialog";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products and their variants.</CardDescription>
        </div>
        <AddProductDialog />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Base UOM</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.displayName}</TableCell>
                <TableCell>{product.baseUOM}</TableCell>
                <TableCell>{product.variants.length}</TableCell>
                <TableCell>
                  {product.active ? <Badge>Active</Badge> : <Badge variant="secondary">Archived</Badge>}
                </TableCell>
                 <TableCell className="text-right">
                    <Button variant="ghost" size="icon" disabled>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
