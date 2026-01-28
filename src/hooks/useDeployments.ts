import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Deployment } from '@/types/agent';

export function useDeployments() {
  return useQuery({
    queryKey: ['deployments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployments')
        .select(`
          *,
          agent:agents(*),
          workflow:workflow_packs(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (Deployment & { agent: any; workflow: any })[];
    },
  });
}

export function useAgentDeployments(agentId: string) {
  return useQuery({
    queryKey: ['agent-deployments', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployments')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deployment[];
    },
    enabled: !!agentId,
  });
}

export function useWorkflowDeployments(workflowId: string) {
  return useQuery({
    queryKey: ['workflow-deployments', workflowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployments')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deployment[];
    },
    enabled: !!workflowId,
  });
}

export function useCreateDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deployment: Omit<Deployment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('deployments')
        .insert(deployment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
  });
}

export function useUpdateDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Deployment> & { id: string }) => {
      const { data, error } = await supabase
        .from('deployments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
  });
}
