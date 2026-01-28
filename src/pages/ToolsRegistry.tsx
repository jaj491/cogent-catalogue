import { Card, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function ToolsRegistry() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tools Registry</h1>
        <p className="text-muted-foreground">
          Connectors, APIs, and MCP endpoints
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Coming Soon</p>
          <p className="text-muted-foreground text-center max-w-md">
            The Tools Registry will help you track shared connectors and endpoints
            across agents to avoid re-engineering common integrations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
