import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGapStats } from '@/hooks/useGaps';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Lightbulb, RefreshCw, Wrench, Plus, Search } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function GapDashboard() {
  const { data: stats, isLoading } = useGapStats();

  if (isLoading) {
    return <div className="text-center py-8">Loading insights...</div>;
  }

  const funnelData = [
    { stage: 'New', count: stats?.byStatus?.['New'] || 0 },
    { stage: 'In Review', count: stats?.byStatus?.['In Review'] || 0 },
    { stage: 'Decision Made', count: stats?.byStatus?.['Decision Made'] || 0 },
    { stage: 'In Build', count: stats?.byStatus?.['In Build'] || 0 },
    { stage: 'Closed', count: stats?.byStatus?.['Closed'] || 0 },
  ];

  const decisionData = [
    { name: 'Reuse', value: stats?.byDecision?.['Reuse existing agent'] || 0 },
    { name: 'Extend', value: stats?.byDecision?.['Extend existing agent or workflow'] || 0 },
    { name: 'Build New', value: stats?.byDecision?.['Build new agent'] || 0 },
    { name: 'Discovery', value: stats?.byDecision?.['Discovery required'] || 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Triage Insights</h2>
        <p className="text-muted-foreground">
          Track how opportunities are being classified and resolved.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              % Reuse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.percentReuse || 0}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Wrench className="h-3 w-3" />
              % Extend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{stats?.percentExtend || 0}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Plus className="h-3 w-3" />
              % Build New
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.percentBuild || 0}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Search className="h-3 w-3" />
              % Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">{stats?.percentDiscovery || 0}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gap Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Gap Funnel</CardTitle>
            <CardDescription>
              Progression of gaps through the decision process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Decision Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Decision Distribution</CardTitle>
            <CardDescription>
              How gaps are being resolved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {decisionData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No decisions recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={decisionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {decisionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer Mantra */}
      <div className="text-center text-sm text-muted-foreground italic py-4 border-t">
        Reuse first. Extend second. Build only when necessary.
      </div>
    </div>
  );
}
