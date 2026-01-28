import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Agent, AgentFilters, AgentType, PlatformType, HostedInType, AgentStatus, FunctionDomainType, OwnerTeamType } from '@/types/agent';

export function useAgents(filters?: Partial<AgentFilters>) {
  return useQuery({
    queryKey: ['agents', filters],
    queryFn: async () => {
      let query = supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.platform && filters.platform.length > 0) {
        query = query.in('platform', filters.platform);
      }

      if (filters?.hosted_in && filters.hosted_in.length > 0) {
        query = query.in('hosted_in', filters.hosted_in);
      }

      if (filters?.agent_type && filters.agent_type.length > 0) {
        query = query.in('agent_type', filters.agent_type);
      }

      if (filters?.owner_team && filters.owner_team.length > 0) {
        query = query.in('owner_team', filters.owner_team);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data as Agent[];
    },
  });
}

export function useAgent(id: string) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Agent;
    },
    enabled: !!id,
  });
}

export function useAgentStats() {
  return useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const { data: agents, error } = await supabase
        .from('agents')
        .select('*');

      if (error) throw error;

      const stats = {
        total: agents.length,
        deployed: agents.filter(a => a.status === 'Deployed').length,
        deployable: agents.filter(a => a.status === 'Deployable').length,
        inProgress: agents.filter(a => a.status === 'In Progress').length,
        ideation: agents.filter(a => a.status === 'Ideation').length,
        uat: agents.filter(a => a.status === 'UAT').length,
        governanceReview: agents.filter(a => a.status === 'Governance Review').length,
        byType: {} as Record<string, number>,
        byPlatform: {} as Record<string, number>,
        byHostedIn: {} as Record<string, number>,
        byStatus: {} as Record<string, number>,
      };

      agents.forEach(agent => {
        stats.byType[agent.agent_type] = (stats.byType[agent.agent_type] || 0) + 1;
        stats.byPlatform[agent.platform] = (stats.byPlatform[agent.platform] || 0) + 1;
        stats.byHostedIn[agent.hosted_in] = (stats.byHostedIn[agent.hosted_in] || 0) + 1;
        stats.byStatus[agent.status] = (stats.byStatus[agent.status] || 0) + 1;
      });

      return stats;
    },
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('agents')
        .insert(agent)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Agent> & { id: string }) => {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', data.id] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
    },
  });
}
