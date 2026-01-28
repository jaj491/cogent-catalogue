import { Link } from 'react-router-dom';
import { useWorkflows } from '@/hooks/useWorkflows';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GitBranch, Bot, Rocket, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const maturityColors: Record<string, string> = {
  'Prototype': 'bg-slate-100 text-slate-700',
  'Pilot': 'bg-blue-100 text-blue-700',
  'Production': 'bg-green-100 text-green-800',
};

export default function WorkflowPacks() {
  const { data: workflows, isLoading } = useWorkflows();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Packs</h1>
          <p className="text-muted-foreground">
            End-to-end multi-agent processes
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflow Packs</h1>
        <p className="text-muted-foreground">
          End-to-end multi-agent processes
        </p>
      </div>

      {workflows && workflows.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Link key={workflow.id} to={`/workflows/${workflow.id}`}>
              <Card className="h-full card-hover cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base line-clamp-2">
                        {workflow.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={cn("text-xs", maturityColors[workflow.maturity])}>
                          {workflow.maturity}
                        </Badge>
                        {workflow.process_area && (
                          <Badge variant="outline" className="text-xs">
                            {workflow.process_area}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <GitBranch className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workflow.business_outcome && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.business_outcome}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {workflow.orchestrator && (
                      <div className="flex items-center gap-1">
                        <Rocket className="h-4 w-4" />
                        <span>{workflow.orchestrator}</span>
                      </div>
                    )}
                  </div>

                  {workflow.stages && workflow.stages.length > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {workflow.stages.filter(s => s.type === 'agent').length} agents
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-primary">
                    View details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No workflow packs yet</p>
            <p className="text-muted-foreground">Create your first workflow pack to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
