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

interface AgentsByStatusChartProps {
  data: Record<string, number>;
}

const statusColors: Record<string, string> = {
  'Ideation': '#94a3b8',
  'In Progress': '#3b82f6',
  'UAT': '#8b5cf6',
  'Governance Review': '#f59e0b',
  'Deployable': '#10b981',
  'Deployed': '#22c55e',
  'Archived': '#6b7280',
};

export function AgentsByStatusChart({ data }: AgentsByStatusChartProps) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const order = ['Ideation', 'In Progress', 'UAT', 'Governance Review', 'Deployable', 'Deployed', 'Archived'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Agents by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={statusColors[entry.name] || '#6b7280'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
