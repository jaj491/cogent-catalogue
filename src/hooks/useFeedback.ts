import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Feedback, UsageMetrics, Defect } from '@/types/agent';

export function useAgentFeedback(agentId: string) {
  return useQuery({
    queryKey: ['agent-feedback', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Feedback[];
    },
    enabled: !!agentId,
  });
}

export function useAgentUsageMetrics(agentId: string) {
  return useQuery({
    queryKey: ['agent-usage', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usage_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .order('time_window_start', { ascending: false });

      if (error) throw error;
      return data as UsageMetrics[];
    },
    enabled: !!agentId,
  });
}

export function useAgentDefects(agentId: string) {
  return useQuery({
    queryKey: ['agent-defects', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('defects')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Defect[];
    },
    enabled: !!agentId,
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('feedback')
        .insert(feedback)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.agent_id) {
        queryClient.invalidateQueries({ queryKey: ['agent-feedback', variables.agent_id] });
      }
    },
  });
}

export function useCreateUsageMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metric: Omit<UsageMetrics, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('usage_metrics')
        .insert(metric)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.agent_id) {
        queryClient.invalidateQueries({ queryKey: ['agent-usage', variables.agent_id] });
      }
    },
  });
}

export function useAgentAverageRating(agentId: string) {
  return useQuery({
    queryKey: ['agent-rating', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('rating')
        .eq('agent_id', agentId)
        .not('rating', 'is', null);

      if (error) throw error;
      
      if (!data || data.length === 0) return null;
      
      const sum = data.reduce((acc, f) => acc + (f.rating || 0), 0);
      return {
        average: sum / data.length,
        count: data.length,
      };
    },
    enabled: !!agentId,
  });
}
