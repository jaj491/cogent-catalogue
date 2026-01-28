import { useAgentStats } from '@/hooks/useAgents';
import { StatCard } from '@/components/dashboard/StatCard';
import { AgentsByStatusChart } from '@/components/dashboard/AgentsByStatusChart';
import { AgentsByPlatformChart } from '@/components/dashboard/AgentsByPlatformChart';
import { AgentsByTypeChart } from '@/components/dashboard/AgentsByTypeChart';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bot, 
  Rocket, 
  CheckCircle, 
  Clock, 
  Lightbulb,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const { data: stats, isLoading } = useAgentStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your AI agent ecosystem
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your AI agent ecosystem
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Agents"
          value={stats?.total || 0}
          subtitle="Across all platforms"
          icon={Bot}
          iconClassName="from-primary to-primary/50"
        />
        <StatCard
          title="Deployed"
          value={stats?.deployed || 0}
          subtitle="Live in production"
          icon={Rocket}
          iconClassName="from-emerald-500 to-emerald-500/50"
        />
        <StatCard
          title="Deployable"
          value={stats?.deployable || 0}
          subtitle="Ready to go live"
          icon={CheckCircle}
          iconClassName="from-cyan-500 to-cyan-500/50"
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress || 0}
          subtitle="Currently being developed"
          icon={Clock}
          iconClassName="from-blue-500 to-blue-500/50"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ideation"
          value={stats?.ideation || 0}
          subtitle="New ideas"
          icon={Lightbulb}
        />
        <StatCard
          title="UAT"
          value={stats?.uat || 0}
          subtitle="In testing"
          icon={TrendingUp}
        />
        <StatCard
          title="Governance Review"
          value={stats?.governanceReview || 0}
          subtitle="Pending approval"
          icon={AlertTriangle}
        />
        <StatCard
          title="Deployment Rate"
          value={stats?.total ? `${Math.round((stats.deployed / stats.total) * 100)}%` : '0%'}
          subtitle="Of total agents"
          icon={Rocket}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AgentsByStatusChart data={stats?.byStatus || {}} />
        <AgentsByPlatformChart data={stats?.byPlatform || {}} />
        <AgentsByTypeChart data={stats?.byType || {}} />
      </div>
    </div>
  );
}
