import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/services/products";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { EditProductDialog } from "@/components/products/edit-product-dialog";
import { DeleteProductDialog } from "@/components/products/delete-product-dialog";

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
                    <EditProductDialog product={product} />
                    <DeleteProductDialog productId={product.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
