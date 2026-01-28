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
  onStatusClick?: (status: string) => void;
  activeStatus?: string | null;
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

export function AgentsByStatusChart({ data, onStatusClick, activeStatus }: AgentsByStatusChartProps) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const order = ['Ideation', 'In Progress', 'UAT', 'Governance Review', 'Deployable', 'Deployed', 'Archived'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  const handleClick = (data: { name: string }) => {
    if (onStatusClick) {
      onStatusClick(data.name);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Agents by Status</CardTitle>
        {onStatusClick && (
          <p className="text-xs text-muted-foreground">Click a bar to drill down</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical" 
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                horizontal={true} 
                vertical={false} 
                stroke="hsl(var(--border))"
              />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120}
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
                cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
                onClick={handleClick}
                style={{ cursor: onStatusClick ? 'pointer' : 'default' }}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={statusColors[entry.name] || '#6b7280'}
                    opacity={activeStatus && activeStatus !== entry.name ? 0.3 : 1}
                    className="transition-opacity duration-200"
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
