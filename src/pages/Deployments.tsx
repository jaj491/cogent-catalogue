import { useDeployments } from '@/hooks/useDeployments';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Rocket, 
  Bot, 
  GitBranch, 
  Calendar,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
  'Planned': 'bg-blue-100 text-blue-700',
  'In UAT': 'bg-purple-100 text-purple-700',
  'Live': 'bg-green-100 text-green-800',
  'Paused': 'bg-amber-100 text-amber-700',
  'Decommissioned': 'bg-gray-100 text-gray-600',
};

export default function Deployments() {
  const { data: deployments, isLoading } = useDeployments();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
          <p className="text-muted-foreground">
            Track where agents and workflows are deployed
          </p>
        </div>
        <div className="grid gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  const liveDeployments = deployments?.filter(d => d.rollout_status === 'Live') || [];
  const inUatDeployments = deployments?.filter(d => d.rollout_status === 'In UAT') || [];
  const plannedDeployments = deployments?.filter(d => d.rollout_status === 'Planned') || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
        <p className="text-muted-foreground">
          Track where agents and workflows are deployed
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live</p>
                <p className="text-3xl font-bold text-green-600">{liveDeployments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In UAT</p>
                <p className="text-3xl font-bold text-purple-600">{inUatDeployments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planned</p>
                <p className="text-3xl font-bold text-blue-600">{plannedDeployments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {deployments && deployments.length > 0 ? (
        <div className="grid gap-4">
          {deployments.map((deployment) => (
            <Card key={deployment.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg",
                      deployment.agent_id ? "bg-blue-100" : "bg-purple-100"
                    )}>
                      {deployment.agent_id ? (
                        <Bot className="h-6 w-6 text-blue-600" />
                      ) : (
                        <GitBranch className="h-6 w-6 text-purple-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {deployment.agent ? (
                          <Link 
                            to={`/library/${deployment.agent.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {deployment.agent.name}
                          </Link>
                        ) : deployment.workflow ? (
                          <Link 
                            to={`/workflows/${deployment.workflow.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {deployment.workflow.name}
                          </Link>
                        ) : (
                          <span className="font-medium">Unknown</span>
                        )}
                        <Badge variant="outline">{deployment.version_label}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>
                          {deployment.client_name || deployment.target_type}
                        </span>
                        <span>•</span>
                        <span>{deployment.environment}</span>
                      </div>
                      {deployment.go_live_date_actual && (
                        <p className="text-xs text-muted-foreground">
                          Live since: {new Date(deployment.go_live_date_actual).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(statusColors[deployment.rollout_status])}>
                      {deployment.rollout_status}
                    </Badge>
                    <Badge variant="outline">{deployment.integration_depth}</Badge>
                  </div>
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
            <p className="text-muted-foreground">Deploy agents and workflows to see them here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
