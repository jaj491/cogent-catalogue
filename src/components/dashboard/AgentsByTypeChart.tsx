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

interface AgentsByTypeChartProps {
  data: Record<string, number>;
  onTypeClick?: (type: string) => void;
  activeType?: string | null;
}

const typeColors: Record<string, string> = {
  'General': '#3b82f6',
  'Sourcing': '#10b981',
  'Contracting': '#8b5cf6',
  'PR2PO': '#f59e0b',
  'AP': '#ef4444',
  'Compliance': '#06b6d4',
};

export function AgentsByTypeChart({ data, onTypeClick, activeType }: AgentsByTypeChartProps) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const handleClick = (data: { name: string }) => {
    if (onTypeClick) {
      onTypeClick(data.name);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Agents by Type</CardTitle>
        {onTypeClick && (
          <p className="text-xs text-muted-foreground">Click a bar to drill down</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ left: 10, right: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="hsl(var(--border))"
              />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
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
                radius={[4, 4, 0, 0]}
                onClick={handleClick}
                style={{ cursor: onTypeClick ? 'pointer' : 'default' }}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={typeColors[entry.name] || '#6b7280'}
                    opacity={activeType && activeType !== entry.name ? 0.3 : 1}
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
