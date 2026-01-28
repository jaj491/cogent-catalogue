import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface AgentsByPlatformChartProps {
  data: Record<string, number>;
}

const platformColors: Record<string, string> = {
  'Quantum Studio': '#6366f1',
  'Quantum Platform': '#8b5cf6',
  'Google Agentspace': '#ef4444',
  'Microsoft Co-Pilot Studio': '#06b6d4',
  'Others': '#6b7280',
};

export function AgentsByPlatformChart({ data }: AgentsByPlatformChartProps) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Agents by Platform</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={platformColors[entry.name] || '#6b7280'} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [value, 'Agents']}
              />
              <Legend 
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Total Agents</p>
        </div>
      </CardContent>
    </Card>
  );
}
