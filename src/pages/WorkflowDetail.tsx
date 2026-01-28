import { useParams, Link } from 'react-router-dom';
import { useWorkflow, useWorkflowAgents } from '@/hooks/useWorkflows';
import { useWorkflowDeployments } from '@/hooks/useDeployments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  ArrowRight,
  GitBranch, 
  Bot, 
  Rocket, 
  Users,
  Zap,
  Server,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const maturityColors: Record<string, string> = {
  'Prototype': 'bg-slate-100 text-slate-700',
  'Pilot': 'bg-blue-100 text-blue-700',
  'Production': 'bg-green-100 text-green-800',
};

const stageIcons: Record<string, React.ElementType> = {
  trigger: Zap,
  orchestration: Server,
  agent: Bot,
  human: Users,
  output: CheckCircle,
};

const stageColors: Record<string, string> = {
  trigger: 'bg-amber-100 border-amber-300',
  orchestration: 'bg-purple-100 border-purple-300',
  agent: 'bg-blue-100 border-blue-300',
  human: 'bg-green-100 border-green-300',
  output: 'bg-emerald-100 border-emerald-300',
};

export default function WorkflowDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: workflow, isLoading } = useWorkflow(id!);
  const { data: agents } = useWorkflowAgents(id!);
  const { data: deployments } = useWorkflowDeployments(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Workflow not found</h2>
        <Link to="/workflows">
          <Button variant="link">Back to Workflows</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link to="/workflows" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Workflow Packs
        </Link>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{workflow.name}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("text-sm", maturityColors[workflow.maturity])}>
                {workflow.maturity}
              </Badge>
              {workflow.process_area && (
                <Badge variant="outline">{workflow.process_area}</Badge>
              )}
              {workflow.orchestrator && (
                <Badge variant="outline">{workflow.orchestrator}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {workflow.problem_statement && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{workflow.problem_statement}</p>
            </CardContent>
          </Card>
        )}

        {workflow.business_outcome && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Outcome</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{workflow.business_outcome}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="flow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flow">Workflow Flow</TabsTrigger>
          <TabsTrigger value="agents">
            Agents
            {agents && agents.length > 0 && (
              <Badge variant="secondary" className="ml-2">{agents.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="deployments">
            Deployments
            {deployments && deployments.length > 0 && (
              <Badge variant="secondary" className="ml-2">{deployments.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="flow" className="space-y-4">
          {workflow.stages && workflow.stages.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  {workflow.stages.map((stage, index) => {
                    const Icon = stageIcons[stage.type] || Bot;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg border",
                          stageColors[stage.type]
                        )}>
                          <Icon className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-sm">{stage.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{stage.type}</p>
                          </div>
                        </div>
                        {index < workflow.stages.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No workflow stages defined</p>
                <p className="text-muted-foreground">Add stages to visualize the workflow</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          {agents && agents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {agents.map((wa) => (
                <Link key={wa.id} to={`/library/${wa.agent?.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">{wa.agent?.name}</p>
                          {wa.role_in_workflow && (
                            <p className="text-sm text-muted-foreground">
                              Role: {wa.role_in_workflow}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {wa.agent?.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {wa.agent?.platform}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No agents linked</p>
                <p className="text-muted-foreground">Link agents to this workflow</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deployments" className="space-y-4">
          {deployments && deployments.length > 0 ? (
            <div className="grid gap-4">
              {deployments.map((deployment) => (
                <Card key={deployment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Rocket className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {deployment.client_name || deployment.target_type}
                          </span>
                          <Badge variant="outline">{deployment.version_label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {deployment.environment} • {deployment.rollout_status}
                        </p>
                      </div>
                      <Badge variant="outline">{deployment.rollout_status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Rocket className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No deployments yet</p>
                <p className="text-muted-foreground">This workflow hasn't been deployed</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {workflow.triggers && workflow.triggers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Triggers</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {workflow.triggers.map((trigger) => (
                    <Badge key={trigger} variant="outline">{trigger}</Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {workflow.systems && workflow.systems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Systems</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {workflow.systems.map((system) => (
                    <Badge key={system} variant="outline">{system}</Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {workflow.owners && workflow.owners.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Owners</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {workflow.owners.map((owner) => (
                    <Badge key={owner} variant="secondary">{owner}</Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {workflow.reusable_pattern_tags && workflow.reusable_pattern_tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pattern Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {workflow.reusable_pattern_tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
