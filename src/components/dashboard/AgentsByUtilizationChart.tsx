import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface AgentsByUtilizationChartProps {
  data: Array<{ name: string; sessions: number }>;
}

const barColors = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function AgentsByUtilizationChart({ data }: AgentsByUtilizationChartProps) {
  const chartData = data.length > 0 
    ? data.slice(0, 8).sort((a, b) => b.sessions - a.sessions)
    : [
        { name: 'No data yet', sessions: 0 },
      ];

  const hasData = data.length > 0 && data.some(d => d.sessions > 0);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Top Agents by Utilization</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Based on total sessions
          </p>
        </div>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                layout="vertical"
                margin={{ left: 0, right: 20, top: 10, bottom: 10 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  horizontal={true}
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  width={120}
                  tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))',
                  }}
                  formatter={(value: number) => [`${value} sessions`, 'Utilization']}
                />
                <Bar 
                  dataKey="sessions" 
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={barColors[index % barColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No utilization data yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Usage metrics will appear here once agents are deployed
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
