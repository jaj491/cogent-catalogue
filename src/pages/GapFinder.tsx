import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function GapFinder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gap Finder</h1>
        <p className="text-muted-foreground">
          Triage new ideas and discover gaps in coverage
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Coming Soon</p>
          <p className="text-muted-foreground text-center max-w-md">
            The Gap Finder will help you identify what to build next by suggesting existing agents 
            that might cover new ideas, preventing duplicate efforts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
