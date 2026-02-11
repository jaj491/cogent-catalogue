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
import { MessageSquare, Star } from 'lucide-react';

interface AgentsByFeedbackChartProps {
  data: Array<{ name: string; rating: number; count: number }>;
}

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return '#10b981'; // emerald
  if (rating >= 4) return '#22c55e'; // green
  if (rating >= 3) return '#f59e0b'; // amber
  if (rating >= 2) return '#f97316'; // orange
  return '#ef4444'; // red
};

export function AgentsByFeedbackChart({ data }: AgentsByFeedbackChartProps) {
  const chartData = data.length > 0
    ? [...data].sort((a, b) => b.rating - a.rating).slice(0, 8)
    : [];

  const hasData = data.length > 0 && data.some(d => d.count > 0);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Top Rated Agents</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Based on user feedback ratings
          </p>
        </div>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-500/50 flex items-center justify-center">
          <Star className="h-4 w-4 text-white" />
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
                  domain={[0, 5]}
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
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(1)} ★ (${props.payload.count} reviews)`, 
                    'Rating'
                  ]}
                />
                <Bar 
                  dataKey="rating" 
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getRatingColor(entry.rating)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No feedback data yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ratings will appear here once users provide feedback
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
