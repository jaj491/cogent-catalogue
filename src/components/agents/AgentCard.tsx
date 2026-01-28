import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Agent } from '@/types/agent';

interface AgentCardProps {
  agent: Agent;
  rating?: { average: number; count: number } | null;
  usage?: number;
}

const statusColors: Record<string, string> = {
  'Ideation': 'bg-slate-100 text-slate-700 border-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'UAT': 'bg-purple-100 text-purple-700 border-purple-200',
  'Governance Review': 'bg-amber-100 text-amber-700 border-amber-200',
  'Deployable': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Deployed': 'bg-green-100 text-green-800 border-green-200',
  'Archived': 'bg-gray-100 text-gray-600 border-gray-200',
};

const platformColors: Record<string, string> = {
  'Quantum Studio': 'bg-indigo-50 text-indigo-700',
  'Quantum Platform': 'bg-violet-50 text-violet-700',
  'Google Agentspace': 'bg-red-50 text-red-700',
  'Microsoft Co-Pilot Studio': 'bg-cyan-50 text-cyan-700',
  'Others': 'bg-gray-50 text-gray-700',
};

export function AgentCard({ agent, rating, usage }: AgentCardProps) {
  return (
    <Link to={`/library/${agent.id}`}>
      <Card className="h-full card-hover cursor-pointer border-border/50 hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight line-clamp-2">
                {agent.name}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", statusColors[agent.status])}
                >
                  {agent.status}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", platformColors[agent.platform])}
                >
                  {agent.platform}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agent.description || 'No description available'}
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            {rating && (
              <div className="flex items-center gap-1 text-amber-600">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{rating.average.toFixed(1)}</span>
                <span className="text-muted-foreground">({rating.count})</span>
              </div>
            )}
            
            {usage !== undefined && usage > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{usage} sessions</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline" className="text-xs font-normal">
              {agent.agent_type}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {agent.hosted_in}
            </Badge>
            {agent.owner_primary && (
              <Badge variant="outline" className="text-xs font-normal">
                <Users className="h-3 w-3 mr-1" />
                {agent.owner_primary}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
