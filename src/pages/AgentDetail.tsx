import { useParams, Link } from 'react-router-dom';
import { useAgent } from '@/hooks/useAgents';
import { useAgentDeployments } from '@/hooks/useDeployments';
import { useAgentWorkflows } from '@/hooks/useWorkflows';
import { useAgentFeedback, useAgentUsageMetrics, useAgentDefects, useAgentAverageRating } from '@/hooks/useFeedback';
import { useAgentUsageMetrics as useAgentUsageSnapshots } from '@/hooks/useUsageMetrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  Rocket, 
  GitBranch, 
  BarChart3, 
  MessageSquare,
  Bug,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoVideoUpload } from '@/components/agents/DemoVideoUpload';

const statusColors: Record<string, string> = {
  'Ideation': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'UAT': 'bg-purple-100 text-purple-700',
  'Governance Review': 'bg-amber-100 text-amber-700',
  'Deployable': 'bg-emerald-100 text-emerald-700',
  'Deployed': 'bg-green-100 text-green-800',
  'Archived': 'bg-gray-100 text-gray-600',
};

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: agent, isLoading } = useAgent(id!);
  const { data: deployments } = useAgentDeployments(id!);
  const { data: workflows } = useAgentWorkflows(id!);
  const { data: feedback } = useAgentFeedback(id!);
  const { data: usage } = useAgentUsageMetrics(id!);
  const { data: usageSnapshots } = useAgentUsageSnapshots(id);
  const { data: defects } = useAgentDefects(id!);
  const { data: rating } = useAgentAverageRating(id!);

  // Get latest unique_users from snapshot data
  const latestUniqueUsers = usageSnapshots?.find(s => s.metric === 'unique_users');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Agent not found</h2>
        <Link to="/library">
          <Button variant="link">Back to Library</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link to="/library" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Library
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge className={cn("text-sm", statusColors[agent.status])}>
              {agent.status}
            </Badge>
            <Badge variant="outline">{agent.platform}</Badge>
            <Badge variant="outline">{agent.agent_type}</Badge>
            <Badge variant="outline">{agent.hosted_in}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {rating && (
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-xl font-bold">{rating.average.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({rating.count} reviews)</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            {agent.description || 'No description available'}
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deployments">
            Deployments
            {deployments && deployments.length > 0 && (
              <Badge variant="secondary" className="ml-2">{deployments.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="feedback">
            Feedback
            {feedback && feedback.length > 0 && (
              <Badge variant="secondary" className="ml-2">{feedback.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="defects">
            Defects
            {defects && defects.length > 0 && (
              <Badge variant="secondary" className="ml-2">{defects.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{agent.owner_primary || 'Not assigned'}</p>
                <p className="text-sm text-muted-foreground">{agent.owner_team || 'No team'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{agent.platform}</p>
                <p className="text-sm text-muted-foreground">Hosted in {agent.hosted_in}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Completion</CardTitle>
              </CardHeader>
              <CardContent>
                {agent.completion_percentage !== null ? (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{agent.completion_percentage}%</p>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${agent.completion_percentage}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Not applicable</p>
                )}
              </CardContent>
            </Card>
          </div>

          {agent.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{agent.notes}</p>
              </CardContent>
            </Card>
          )}

          {(agent.can_be_marketed || agent.can_be_demoed) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                {agent.can_be_marketed && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Can be marketed
                  </Badge>
                )}
                {agent.can_be_demoed && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Can be demoed
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Demo Video */}
          <DemoVideoUpload agent={agent} />
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
                      <Badge 
                        className={cn(
                          deployment.rollout_status === 'Live' && 'bg-green-100 text-green-800',
                          deployment.rollout_status === 'In UAT' && 'bg-purple-100 text-purple-700',
                          deployment.rollout_status === 'Planned' && 'bg-blue-100 text-blue-700',
                        )}
                      >
                        {deployment.rollout_status}
                      </Badge>
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
                <p className="text-muted-foreground">This agent hasn't been deployed to any environment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          {workflows && workflows.length > 0 ? (
            <div className="grid gap-4">
              {workflows.map((workflow) => (
                <Link key={workflow.id} to={`/workflows/${workflow.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{workflow.name}</span>
                          </div>
                          {workflow.role_in_workflow && (
                            <p className="text-sm text-muted-foreground">
                              Role: {workflow.role_in_workflow}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">{workflow.maturity}</Badge>
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
                <p className="text-lg font-medium">Not part of any workflows</p>
                <p className="text-muted-foreground">This agent isn't included in any workflow packs</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          {/* Unique Users from Snapshot */}
          {latestUniqueUsers && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Adoption Metrics
                </CardTitle>
                <CardDescription>
                  {latestUniqueUsers.account} • {latestUniqueUsers.time_window_start} to {latestUniqueUsers.time_window_end}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{latestUniqueUsers.value}</span>
                  <span className="text-muted-foreground">unique users</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Source: {latestUniqueUsers.data_source} • Confidence: {latestUniqueUsers.match_confidence || 'Auto'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* All Unique Users by Account */}
          {usageSnapshots && usageSnapshots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Usage by Account</CardTitle>
                <CardDescription>All imported usage metrics for this agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageSnapshots.filter(s => s.metric === 'unique_users').map((snapshot) => (
                    <div key={snapshot.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{snapshot.account}</p>
                        <p className="text-xs text-muted-foreground">
                          {snapshot.time_window_start} → {snapshot.time_window_end}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{snapshot.value}</p>
                        <p className="text-xs text-muted-foreground">{snapshot.metric}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legacy Usage Metrics */}
          {usage && usage.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {usage.slice(0, 1).map((metric) => (
                <>
                  <Card key={`${metric.id}-sessions`}>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{metric.total_sessions}</p>
                    </CardContent>
                  </Card>
                  <Card key={`${metric.id}-success`}>
                    <CardHeader className="pb-2">
                      <CardDescription>Success Rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {metric.total_sessions > 0 
                          ? Math.round((metric.successful_interactions / metric.total_sessions) * 100) 
                          : 0}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card key={`${metric.id}-containment`}>
                    <CardHeader className="pb-2">
                      <CardDescription>Containment Rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {metric.containment_rate ? `${(metric.containment_rate * 100).toFixed(0)}%` : 'N/A'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card key={`${metric.id}-north-star`}>
                    <CardHeader className="pb-2">
                      <CardDescription>North Star Score</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {metric.north_star_score?.toFixed(1) || 'N/A'}
                      </p>
                    </CardContent>
                  </Card>
                </>
              ))}
            </div>
          )}

          {/* Empty State */}
          {(!usage || usage.length === 0) && (!usageSnapshots || usageSnapshots.length === 0) && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No usage data yet</p>
                <p className="text-muted-foreground">Usage metrics will appear here once collected</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          {feedback && feedback.length > 0 ? (
            <div className="space-y-4">
              {feedback.map((fb) => (
                <Card key={fb.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {fb.rating && (
                            <div className="flex items-center gap-1 text-amber-600">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-4 w-4",
                                    i < fb.rating! ? "fill-current" : "fill-none"
                                  )} 
                                />
                              ))}
                            </div>
                          )}
                          <Badge variant="outline">{fb.category}</Badge>
                        </div>
                        {fb.comment && (
                          <p className="text-muted-foreground">{fb.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {fb.created_by || 'Anonymous'} • {new Date(fb.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        className={cn(
                          fb.status === 'New' && 'bg-blue-100 text-blue-700',
                          fb.status === 'Resolved' && 'bg-green-100 text-green-700',
                          fb.status === 'In Fix' && 'bg-amber-100 text-amber-700',
                        )}
                      >
                        {fb.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No feedback yet</p>
                <p className="text-muted-foreground">Be the first to leave feedback for this agent</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="defects" className="space-y-4">
          {defects && defects.length > 0 ? (
            <div className="space-y-4">
              {defects.map((defect) => (
                <Card key={defect.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Bug className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{defect.description}</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            className={cn(
                              defect.severity === 'Critical' && 'bg-red-100 text-red-700',
                              defect.severity === 'High' && 'bg-orange-100 text-orange-700',
                              defect.severity === 'Medium' && 'bg-amber-100 text-amber-700',
                              defect.severity === 'Low' && 'bg-blue-100 text-blue-700',
                            )}
                          >
                            {defect.severity}
                          </Badge>
                          {defect.root_cause && (
                            <Badge variant="outline">{defect.root_cause}</Badge>
                          )}
                        </div>
                        {defect.fix_owner && (
                          <p className="text-sm text-muted-foreground">
                            Owner: {defect.fix_owner}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">{defect.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bug className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No defects reported</p>
                <p className="text-muted-foreground">This agent has no known issues</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
