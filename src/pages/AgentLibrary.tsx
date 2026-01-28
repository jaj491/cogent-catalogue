import { useState } from 'react';
import { useAgents } from '@/hooks/useAgents';
import { AgentCard } from '@/components/agents/AgentCard';
import { AgentFilters } from '@/components/agents/AgentFilters';
import { Skeleton } from '@/components/ui/skeleton';
import type { AgentFilters as FiltersType } from '@/types/agent';

export default function AgentLibrary() {
  const [filters, setFilters] = useState<Partial<FiltersType>>({
    search: '',
    status: [],
    platform: [],
    hosted_in: [],
    agent_type: [],
  });

  const { data: agents, isLoading } = useAgents(filters);

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : agents && agents.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {agents.length} agent{agents.length !== 1 ? 's' : ''}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </>
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
