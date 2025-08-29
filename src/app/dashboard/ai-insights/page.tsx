'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateSuggestions } from '@/app/actions';
import { BrainCircuit, Sparkles } from 'lucide-react';

const placeholderData = `SKU,Location,Quantity,LastMoved
SKU-A1-L,Main Warehouse,1205,2023-10-26
SKU-R2-S,Downtown Store,52,2023-10-28
SKU-M3-M,Main Warehouse,780,2023-10-22
SKU-T4-L,Eastside Warehouse,450,2023-09-15
SKU-B5-S,Downtown Store,-10,2023-10-29
SKU-A1-S,Main Warehouse,2500,2023-10-20
SKU-R2-L,Eastside Warehouse,300,2023-08-01`;

export default function AiInsightsPage() {
  const [inventoryData, setInventoryData] = useState(placeholderData);
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setSuggestions('');
    const result = await generateSuggestions({ inventoryData });
    setIsLoading(false);
    if (result.success) {
      setSuggestions(result.suggestions ?? '');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Driven Inventory Insights</CardTitle>
          <CardDescription>
            Paste your inventory data (e.g., from a CSV) to get AI-powered optimization suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Label htmlFor="inventory-data">Inventory Data</Label>
            <Textarea
              id="inventory-data"
              value={inventoryData}
              onChange={(e) => setInventoryData(e.target.value)}
              placeholder="Paste your inventory data here..."
              className="min-h-[200px] font-code text-sm"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating...' : <> <Sparkles className="mr-2 h-4 w-4" /> Generate Suggestions</>}
          </Button>
        </CardFooter>
      </Card>

      {(isLoading || suggestions) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
              </div>
            )}
            {suggestions && (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
                {suggestions}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
