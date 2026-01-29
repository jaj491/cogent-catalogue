import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToolsRegistryStats } from '@/hooks/useToolsRegistry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Wrench, 
  Zap, 
  Server, 
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Bot,
  GitBranch,
  BarChart3,
  Grid3X3,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExecutionLane, HealthStatus } from '@/types/agent';

const systemTypeColors: Record<string, string> = {
  'ERP': 'bg-blue-100 text-blue-800',
  'CLM': 'bg-purple-100 text-purple-800',
  'P2P': 'bg-green-100 text-green-800',
  'Intake': 'bg-amber-100 text-amber-800',
  'Collaboration': 'bg-cyan-100 text-cyan-800',
  'Data': 'bg-indigo-100 text-indigo-800',
  'AI': 'bg-pink-100 text-pink-800',
  'RPA': 'bg-orange-100 text-orange-800',
};

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
  'Healthy': 'text-green-500',
  'Degraded': 'text-amber-500',
  'At Risk': 'text-red-500',
};

export default function ToolsRegistry() {
  const { data: stats, isLoading } = useToolsRegistryStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tools Registry</h1>
          <p className="text-muted-foreground">
            Manage tools, skills, and platform-specific endpoints
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const filteredTools = stats?.tools.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredSkills = stats?.skills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate top reused skills
  const topSkills = stats?.skills
    .map(s => ({
      ...s,
      totalUsage: (stats.skillUsage[s.id]?.agents || 0) + (stats.skillUsage[s.id]?.workflows || 0),
      agentUsage: stats.skillUsage[s.id]?.agents || 0,
      workflowUsage: stats.skillUsage[s.id]?.workflows || 0,
    }))
    .sort((a, b) => b.totalUsage - a.totalUsage)
    .slice(0, 10) || [];

  // Calculate coverage gaps
  const coverageGaps = stats?.skills.filter(skill => {
    const coverage = stats.coverageMatrix[skill.id];
    return !coverage?.Quantum || !coverage?.Azure || !coverage?.GCP;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tools Registry</h1>
          <p className="text-muted-foreground">
            Agents declare Skills → Skills resolve to platform-specific Endpoints
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tools</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTools || 0}</div>
            <p className="text-xs text-muted-foreground">System integrations</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSkills || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.skillsByStatus.Approved || 0} approved
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Endpoints</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEndpoints || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.endpointsByHealth.Healthy || 0} healthy
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Coverage Gaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coverageGaps.length}</div>
            <p className="text-xs text-muted-foreground">Skills missing endpoints</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools and skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <Grid3X3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tools" className="gap-2">
            <Wrench className="h-4 w-4" />
            Tools
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-2">
            <Zap className="h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="coverage" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Coverage
          </TabsTrigger>
          <TabsTrigger value="reuse" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Reuse
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Architecture Diagram */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Architecture</CardTitle>
                <CardDescription>
                  Agents are portable logic, Skills are reusable capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 py-6">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Agents</p>
                    <p className="text-xs text-muted-foreground">Declare Skills</p>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                      <Zap className="h-6 w-6 text-amber-500" />
                    </div>
                    <p className="text-sm font-medium">Skills</p>
                    <p className="text-xs text-muted-foreground">Reusable Capabilities</p>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                      <Server className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-sm font-medium">Endpoints</p>
                    <p className="text-xs text-muted-foreground">Platform-Specific</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Healthy Endpoints</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{stats?.endpointsByHealth.Healthy || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Degraded Endpoints</span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{stats?.endpointsByHealth.Degraded || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">At Risk Endpoints</span>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{stats?.endpointsByHealth['At Risk'] || 0}</span>
                  </div>
                </div>
                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="text-sm">Approved Skills</span>
                  <Badge className="bg-green-100 text-green-800">{stats?.skillsByStatus.Approved || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Draft Skills</span>
                  <Badge variant="secondary">{stats?.skillsByStatus.Draft || 0}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-4">
          {filteredTools.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No tools found</p>
                <p className="text-muted-foreground">Add tools to track system integrations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <Link key={tool.id} to={`/tools/${tool.id}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                        <Badge className={cn("text-xs", systemTypeColors[tool.system_type])}>
                          {tool.system_type}
                        </Badge>
                      </div>
                      {tool.vendor && (
                        <CardDescription>{tool.vendor}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {tool.supported_lanes?.map((lane) => (
                          <Badge key={lane} variant="outline" className="text-xs">
                            {lane}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Skills</span>
                        <span className="font-medium">
                          {stats?.skills.filter(s => s.tool_id === tool.id).length || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          {filteredSkills.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No skills found</p>
                <p className="text-muted-foreground">Add skills to define reusable capabilities</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSkills.map((skill) => {
                const usage = stats?.skillUsage[skill.id];
                const coverage = stats?.coverageMatrix[skill.id];
                
                return (
                  <Link key={skill.id} to={`/tools/skill/${skill.id}`}>
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base line-clamp-1">{skill.name}</CardTitle>
                          <Badge className={cn("text-xs shrink-0", statusColors[skill.status])}>
                            {skill.status}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {skill.description || 'No description'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {skill.capability_category}
                          </Badge>
                          <Badge className={cn("text-xs", riskColors[skill.risk_level])}>
                            {skill.risk_level} Risk
                          </Badge>
                        </div>
                        
                        {/* Endpoint Coverage */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Coverage:</span>
                          <div className="flex gap-1">
                            {(['Quantum', 'Azure', 'GCP'] as ExecutionLane[]).map((lane) => {
                              const endpoint = coverage?.[lane];
                              const Icon = endpoint 
                                ? healthIcons[endpoint.health_status as HealthStatus] 
                                : XCircle;
                              return (
                                <div 
                                  key={lane} 
                                  className="flex items-center gap-0.5"
                                  title={`${lane}: ${endpoint ? endpoint.health_status : 'Not available'}`}
                                >
                                  <Icon className={cn(
                                    "h-3.5 w-3.5",
                                    endpoint ? healthColors[endpoint.health_status as HealthStatus] : 'text-muted-foreground/30'
                                  )} />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Usage */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            {usage?.agents || 0} agents
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {usage?.workflows || 0} workflows
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Coverage Tab */}
        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Endpoint Coverage Matrix</CardTitle>
              <CardDescription>
                Skills availability across execution lanes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.skills.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No skills to display</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium">Skill</th>
                        <th className="text-center py-2 px-4 font-medium">Quantum</th>
                        <th className="text-center py-2 px-4 font-medium">Azure</th>
                        <th className="text-center py-2 px-4 font-medium">GCP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.skills.map((skill) => {
                        const coverage = stats.coverageMatrix[skill.id];
                        return (
                          <tr key={skill.id} className="border-b last:border-0">
                            <td className="py-2 pr-4">
                              <Link 
                                to={`/tools/skill/${skill.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {skill.name}
                              </Link>
                            </td>
                            {(['Quantum', 'Azure', 'GCP'] as ExecutionLane[]).map((lane) => {
                              const endpoint = coverage?.[lane];
                              if (!endpoint) {
                                return (
                                  <td key={lane} className="text-center py-2 px-4">
                                    <XCircle className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                                  </td>
                                );
                              }
                              const Icon = healthIcons[endpoint.health_status as HealthStatus];
                              return (
                                <td key={lane} className="text-center py-2 px-4">
                                  <div className="flex flex-col items-center gap-0.5">
                                    <Icon className={cn("h-4 w-4", healthColors[endpoint.health_status as HealthStatus])} />
                                    <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                                      {endpoint.name}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reuse Tab */}
        <TabsContent value="reuse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills Reuse Dashboard</CardTitle>
              <CardDescription>
                Top 10 most reused skills across agents and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topSkills.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No usage data yet</p>
              ) : (
                <div className="space-y-3">
                  {topSkills.map((skill, index) => (
                    <div 
                      key={skill.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                    >
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/tools/skill/${skill.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {skill.name}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            {skill.agentUsage} agents
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {skill.workflowUsage} workflows
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {skill.totalUsage} uses
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
