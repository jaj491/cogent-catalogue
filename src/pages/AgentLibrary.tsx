import { useState, useMemo } from 'react';
import { useAgents } from '@/hooks/useAgents';
import { useAgentRatings } from '@/hooks/useAgentRatings';
import { AgentCard } from '@/components/agents/AgentCard';
import { AgentFilters } from '@/components/agents/AgentFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AgentFilters as FiltersType, AgentType, Agent } from '@/types/agent';

// Agent types in display order
const AGENT_TYPE_ORDER: AgentType[] = [
  'General',
  'Sourcing', 
  'Contracting',
  'PR2PO',
  'AP',
  'Compliance',
];

const typeDescriptions: Record<AgentType, string> = {
  'General': 'Multi-purpose agents for various tasks',
  'Sourcing': 'Supplier discovery and procurement assistance',
  'Contracting': 'Contract management and negotiation support',
  'PR2PO': 'Purchase requisition to purchase order automation',
  'AP': 'Accounts payable and invoice processing',
  'Compliance': 'Regulatory compliance and policy enforcement',
};

export default function AgentLibrary() {
  const [filters, setFilters] = useState<Partial<FiltersType>>({
    search: '',
    status: [],
    platform: [],
    hosted_in: [],
    agent_type: [],
  });
  const [collapsedSections, setCollapsedSections] = useState<Set<AgentType>>(new Set());

  const { data: agents, isLoading } = useAgents(filters);
  const { data: ratings } = useAgentRatings();

  // Group agents by type
  const groupedAgents = useMemo(() => {
    if (!agents) return {};
    
    const groups: Record<AgentType, Agent[]> = {
      'General': [],
      'Sourcing': [],
      'Contracting': [],
      'PR2PO': [],
      'AP': [],
      'Compliance': [],
    };

    agents.forEach(agent => {
      if (groups[agent.agent_type]) {
        groups[agent.agent_type].push(agent);
      }
    });

    return groups;
  }, [agents]);

  const toggleSection = (type: AgentType) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const getRatingForAgent = (agentId: string) => {
    if (!ratings || !ratings[agentId]) return null;
    return {
      average: ratings[agentId].average_rating,
      count: ratings[agentId].feedback_count,
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Library</h1>
        <p className="text-muted-foreground">
          Browse and discover AI agents across all platforms
        </p>
      </div>

      <AgentFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-64" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : agents && agents.length > 0 ? (
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground">
            Showing {agents.length} agent{agents.length !== 1 ? 's' : ''} across {AGENT_TYPE_ORDER.filter(t => groupedAgents[t]?.length > 0).length} categories
          </p>
          
          {AGENT_TYPE_ORDER.map(type => {
            const typeAgents = groupedAgents[type] || [];
            if (typeAgents.length === 0) return null;

            const isCollapsed = collapsedSections.has(type);

            return (
              <div key={type} className="space-y-4">
                <button
                  onClick={() => toggleSection(type)}
                  className="flex items-center gap-3 w-full text-left group"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? (
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {type}
                    </h2>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {typeAgents.length}
                  </Badge>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {typeDescriptions[type]}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pl-7">
                    {typeAgents.map((agent) => (
                      <AgentCard 
                        key={agent.id} 
                        agent={agent} 
                        rating={getRatingForAgent(agent.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">No agents found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
