import { useState } from 'react';
import { useAgentStats, useAgents } from '@/hooks/useAgents';
import { useTopUtilizedAgents, useTopRatedAgents } from '@/hooks/useAgentRatings';
import { useTopAgentsBySessions } from '@/hooks/useUsageMetrics';
import { ClickableStatCard } from '@/components/dashboard/ClickableStatCard';
import { AgentsByStatusChart } from '@/components/dashboard/AgentsByStatusChart';
import { AgentsByPlatformChart } from '@/components/dashboard/AgentsByPlatformChart';
import { AgentsByTypeChart } from '@/components/dashboard/AgentsByTypeChart';
import { AgentsByUtilizationChart } from '@/components/dashboard/AgentsByUtilizationChart';
import { AgentsByFeedbackChart } from '@/components/dashboard/AgentsByFeedbackChart';
import { AgentDrillDown } from '@/components/dashboard/AgentDrillDown';
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

type DrillDownState = {
  type: 'status' | 'platform' | 'type';
  value: string;
  title: string;
} | null;

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useAgentStats();
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: utilizationData } = useTopUtilizedAgents();
  const { data: feedbackData } = useTopRatedAgents();
  const { data: sessionsData } = useTopAgentsBySessions();
  const [drillDown, setDrillDown] = useState<DrillDownState>(null);

  const handleStatusClick = (status: string) => {
    if (drillDown?.type === 'status' && drillDown.value === status) {
      setDrillDown(null);
    } else {
      setDrillDown({ type: 'status', value: status, title: `${status} Agents` });
    }
  };

  const handlePlatformClick = (platform: string) => {
    if (drillDown?.type === 'platform' && drillDown.value === platform) {
      setDrillDown(null);
    } else {
      setDrillDown({ type: 'platform', value: platform, title: `${platform} Agents` });
    }
  };

  const handleTypeClick = (type: string) => {
    if (drillDown?.type === 'type' && drillDown.value === type) {
      setDrillDown(null);
    } else {
      setDrillDown({ type: 'type', value: type, title: `${type} Agents` });
    }
  };

  const handleStatCardClick = (status: string, title: string) => {
    if (drillDown?.type === 'status' && drillDown.value === status) {
      setDrillDown(null);
    } else {
      setDrillDown({ type: 'status', value: status, title });
    }
  };

  if (statsLoading) {
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
            <Skeleton key={i} className="h-32 bg-card/50" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] bg-card/50" />
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
          Overview of your AI agent ecosystem • Click any metric to drill down
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ClickableStatCard
          title="Total Agents"
          value={stats?.total || 0}
          subtitle="Across all platforms"
          icon={Bot}
          iconClassName="from-primary to-primary/50"
        />
        <ClickableStatCard
          title="Deployed"
          value={stats?.deployed || 0}
          subtitle="Live in production"
          icon={Rocket}
          iconClassName="from-emerald-500 to-emerald-500/50"
          onClick={() => handleStatCardClick('Deployed', 'Deployed Agents')}
          isActive={drillDown?.value === 'Deployed'}
        />
        <ClickableStatCard
          title="Deployable"
          value={stats?.deployable || 0}
          subtitle="Ready to go live"
          icon={CheckCircle}
          iconClassName="from-cyan-500 to-cyan-500/50"
          onClick={() => handleStatCardClick('Deployable', 'Deployable Agents')}
          isActive={drillDown?.value === 'Deployable'}
        />
        <ClickableStatCard
          title="In Progress"
          value={stats?.inProgress || 0}
          subtitle="Currently being developed"
          icon={Clock}
          iconClassName="from-blue-500 to-blue-500/50"
          onClick={() => handleStatCardClick('In Progress', 'In Progress Agents')}
          isActive={drillDown?.value === 'In Progress'}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ClickableStatCard
          title="Ideation"
          value={stats?.ideation || 0}
          subtitle="New ideas"
          icon={Lightbulb}
          onClick={() => handleStatCardClick('Ideation', 'Ideation Agents')}
          isActive={drillDown?.value === 'Ideation'}
        />
        <ClickableStatCard
          title="UAT"
          value={stats?.uat || 0}
          subtitle="In testing"
          icon={TrendingUp}
          onClick={() => handleStatCardClick('UAT', 'UAT Agents')}
          isActive={drillDown?.value === 'UAT'}
        />
        <ClickableStatCard
          title="Governance Review"
          value={stats?.governanceReview || 0}
          subtitle="Pending approval"
          icon={AlertTriangle}
          onClick={() => handleStatCardClick('Governance Review', 'Governance Review Agents')}
          isActive={drillDown?.value === 'Governance Review'}
        />
        <ClickableStatCard
          title="Deployment Rate"
          value={stats?.total ? `${Math.round((stats.deployed / stats.total) * 100)}%` : '0%'}
          subtitle="Of total agents"
          icon={Rocket}
        />
      </div>

      {/* Drill Down Panel */}
      {drillDown && agents && (
        <AgentDrillDown
          title={drillDown.title}
          filterType={drillDown.type}
          filterValue={drillDown.value}
          agents={agents}
          onClose={() => setDrillDown(null)}
        />
      )}

      {/* Charts - Row 1 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AgentsByStatusChart 
          data={stats?.byStatus || {}} 
          onStatusClick={handleStatusClick}
          activeStatus={drillDown?.type === 'status' ? drillDown.value : null}
        />
        <AgentsByPlatformChart 
          data={stats?.byPlatform || {}} 
          onPlatformClick={handlePlatformClick}
          activePlatform={drillDown?.type === 'platform' ? drillDown.value : null}
        />
        <AgentsByTypeChart 
          data={stats?.byType || {}} 
          onTypeClick={handleTypeClick}
          activeType={drillDown?.type === 'type' ? drillDown.value : null}
        />
      </div>

      {/* Charts - Row 2: Utilization & Feedback */}
      <div className="grid gap-6 md:grid-cols-2">
        <AgentsByUtilizationChart data={utilizationData || []} />
        <AgentsByFeedbackChart data={feedbackData || []} />
      </div>

      {/* Charts - Row 3: Sessions-based Utilization */}
      <div className="grid gap-6 md:grid-cols-1">
        <AgentsByUtilizationChart 
          data={(sessionsData || []).map((d: any) => ({ 
            name: d.agents?.name || d.agent_name || 'Unknown', 
            sessions: d.value 
          }))} 
        />
      </div>
    </div>
  );
}
