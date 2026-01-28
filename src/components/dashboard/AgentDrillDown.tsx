import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  ExternalLink, 
  Bot, 
  ArrowRight,
  Server,
  Users
} from 'lucide-react';
import type { Agent } from '@/types/agent';

interface AgentDrillDownProps {
  title: string;
  filterType: 'status' | 'platform' | 'type';
  filterValue: string;
  agents: Agent[];
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  'Ideation': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'UAT': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'Governance Review': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Deployable': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Deployed': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Archived': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

export function AgentDrillDown({ 
  title, 
  filterType, 
  filterValue, 
  agents, 
  onClose 
}: AgentDrillDownProps) {
  const navigate = useNavigate();

  const filteredAgents = agents.filter(agent => {
    switch (filterType) {
      case 'status':
        return agent.status === filterValue;
      case 'platform':
        return agent.platform === filterValue;
      case 'type':
        return agent.agent_type === filterValue;
      default:
        return true;
    }
  });

  const handleViewAll = () => {
    const params = new URLSearchParams();
    if (filterType === 'status') {
      params.set('status', filterValue);
    } else if (filterType === 'platform') {
      params.set('platform', filterValue);
    } else if (filterType === 'type') {
      params.set('type', filterValue);
    }
    navigate(`/library?${params.toString()}`);
  };

  const handleViewAgent = (agentId: string) => {
    navigate(`/library/${agentId}`);
  };

  return (
    <Card className="border-primary/30 bg-card/80 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewAll}
            className="gap-1"
          >
            View All in Library
            <ArrowRight className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-2">
            {filteredAgents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No agents found
              </div>
            ) : (
              filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleViewAgent(agent.id)}
                  className="group flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/20 cursor-pointer transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                        {agent.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] px-1.5 py-0 ${statusColors[agent.status] || ''}`}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Server className="h-3 w-3" />
                        {agent.platform}
                      </span>
                      {agent.owner_team && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {agent.owner_team}
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
