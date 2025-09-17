import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Orders</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight font-headline">
            You have no orders
          </h3>
          <p className="text-sm text-muted-foreground">
            Your recent orders will appear here.
          </p>
          <Button className="mt-4">Create Order</Button>
        </div>
      </div>
    </div>
  );
}
