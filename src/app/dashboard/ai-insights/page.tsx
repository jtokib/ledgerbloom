'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateSuggestions } from '@/app/actions';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { useCustomClaims } from '@/hooks/use-custom-claims';

export default function AiInsightsPage() {
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { claims } = useCustomClaims();

  const handleGenerate = async () => {
    if (!claims?.organizationId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Organization ID not found',
      });
      return;
    }

    setIsLoading(true);
    setSuggestions('');
    const result = await generateSuggestions({ organizationId: claims.organizationId });
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
            Generate AI-powered optimization suggestions based on your live inventory and movement data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click the button below to have our AI analyze your current inventory levels and recent transaction history. 
            It will provide actionable insights to help you manage stock more effectively, reduce waste, and improve efficiency.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Analyzing Live Data...' : <> <Sparkles className="mr-2 h-4 w-4" /> Generate Suggestions</>}
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
