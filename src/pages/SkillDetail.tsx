import { useParams, Link } from 'react-router-dom';
import { useSkill, useEndpointsBySkill, useSkillAgents, useSkillWorkflows } from '@/hooks/useToolsRegistry';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Zap, 
  Server,
  Bot,
  GitBranch,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExecutionLane, HealthStatus } from '@/types/agent';

const riskColors: Record<string, string> = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-amber-100 text-amber-800',
  'High': 'bg-red-100 text-red-800',
};

const statusColors: Record<string, string> = {
  'Draft': 'bg-slate-100 text-slate-700',
  'Approved': 'bg-green-100 text-green-800',
  'Deprecated': 'bg-red-100 text-red-800',
};

const healthIcons: Record<HealthStatus, React.ElementType> = {
  'Healthy': CheckCircle,
  'Degraded': AlertTriangle,
  'At Risk': XCircle,
};

const healthColors: Record<HealthStatus, string> = {
  'Healthy': 'text-green-500 bg-green-500/10',
  'Degraded': 'text-amber-500 bg-amber-500/10',
  'At Risk': 'text-red-500 bg-red-500/10',
};

const laneColors: Record<ExecutionLane, string> = {
  'Quantum': 'border-indigo-500 bg-indigo-500/10',
  'Azure': 'border-blue-500 bg-blue-500/10',
  'GCP': 'border-red-500 bg-red-500/10',
};

export default function SkillDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: skill, isLoading } = useSkill(id!);
  const { data: endpoints } = useEndpointsBySkill(id!);
  const { data: agentRelations } = useSkillAgents(id!);
  const { data: workflowRelations } = useSkillWorkflows(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Skill not found</h2>
        <Link to="/tools">
          <Button variant="link">Back to Tools Registry</Button>
        </Link>
      </div>
    );
  }

  // Build coverage matrix
  const lanes: ExecutionLane[] = ['Quantum', 'Azure', 'GCP'];
  const endpointsByLane: Record<ExecutionLane, typeof endpoints[0] | null> = {
    Quantum: null,
    Azure: null,
    GCP: null,
  };
  endpoints?.forEach(ep => {
    endpointsByLane[ep.execution_lane as ExecutionLane] = ep;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link to="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Tools Registry
        </Link>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{skill.name}</h1>
                {skill.tool && (
                  <Link 
                    to={`/tools/${skill.tool.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {skill.tool.name}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("text-sm", statusColors[skill.status])}>
                {skill.status}
              </Badge>
              <Badge variant="outline">{skill.capability_category}</Badge>
              <Badge className={cn("text-sm", riskColors[skill.risk_level])}>
                {skill.risk_level} Risk
              </Badge>
              {skill.reusability_rating && (
                <Badge variant="secondary">
                  Reusability: {skill.reusability_rating}/5
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description & I/O */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {skill.description || 'No description provided'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Inputs / Outputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Inputs</p>
              <p className="text-sm text-muted-foreground">
                {skill.inputs || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Outputs</p>
              <p className="text-sm text-muted-foreground">
                {skill.outputs || 'Not specified'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Coverage Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-5 w-5" />
            Endpoint Coverage
          </CardTitle>
          <CardDescription>
            Platform-specific implementations of this skill
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {lanes.map((lane) => {
              const endpoint = endpointsByLane[lane];
              
              if (!endpoint) {
                return (
                  <div 
                    key={lane}
                    className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center"
                  >
                    <XCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="font-medium text-muted-foreground">{lane}</p>
                    <p className="text-sm text-muted-foreground/60">Not available</p>
                  </div>
                );
              }

              const Icon = healthIcons[endpoint.health_status as HealthStatus];
              
              return (
                <div 
                  key={lane}
                  className={cn(
                    "p-4 rounded-lg border-2",
                    laneColors[lane]
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{lane}</span>
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                      healthColors[endpoint.health_status as HealthStatus]
                    )}>
                      <Icon className="h-3 w-3" />
                      {endpoint.health_status}
                    </div>
                  </div>
                  <p className="font-medium text-sm">{endpoint.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {endpoint.implementation_type}
                  </p>
                  {endpoint.endpoint_reference && (
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded mt-2 block truncate">
                      {endpoint.endpoint_reference}
                    </code>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {endpoint.environment}
                    </Badge>
                    {endpoint.last_tested_at && (
                      <span>
                        Tested: {new Date(endpoint.last_tested_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Usage: Agents & Workflows */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Agents using this skill */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agents ({agentRelations?.length || 0})
            </CardTitle>
            <CardDescription>Agents that use this skill</CardDescription>
          </CardHeader>
          <CardContent>
            {agentRelations && agentRelations.length > 0 ? (
              <div className="space-y-2">
                {agentRelations.map((rel: any) => (
                  <Link 
                    key={rel.id} 
                    to={`/library/${rel.agent?.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{rel.agent?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {rel.is_required ? (
                        <Badge variant="default" className="text-xs">Required</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Optional</Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                No agents use this skill yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Workflows using this skill */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Workflows ({workflowRelations?.length || 0})
            </CardTitle>
            <CardDescription>Workflow packs that depend on this skill</CardDescription>
          </CardHeader>
          <CardContent>
            {workflowRelations && workflowRelations.length > 0 ? (
              <div className="space-y-2">
                {workflowRelations.map((rel: any) => (
                  <Link 
                    key={rel.id} 
                    to={`/workflows/${rel.workflow?.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{rel.workflow?.name}</span>
                        {rel.stage_in_workflow && (
                          <p className="text-xs text-muted-foreground">
                            Stage: {rel.stage_in_workflow}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {rel.is_required ? (
                        <Badge variant="default" className="text-xs">Required</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Optional</Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                No workflows depend on this skill yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
