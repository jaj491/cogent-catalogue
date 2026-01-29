import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Gap = Database['public']['Tables']['gaps']['Row'];
export type GapInsert = Database['public']['Tables']['gaps']['Insert'];
export type GapUpdate = Database['public']['Tables']['gaps']['Update'];
export type GapMatch = Database['public']['Tables']['gap_matches']['Row'];

export type GapStatus = Database['public']['Enums']['gap_status'];
export type GapTrigger = Database['public']['Enums']['gap_trigger'];
export type UrgencyLevel = Database['public']['Enums']['urgency_level'];
export type ImpactLevel = Database['public']['Enums']['impact_level'];
export type GapDecision = Database['public']['Enums']['gap_decision'];
export type SuggestedAction = Database['public']['Enums']['suggested_action'];
export type MatchType = Database['public']['Enums']['match_type'];

export function useGaps() {
  return useQuery({
    queryKey: ['gaps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gaps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Gap[];
    },
  });
}

export function useGap(id: string) {
  return useQuery({
    queryKey: ['gap', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gaps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Gap;
    },
    enabled: !!id,
  });
}

export function useGapMatches(gapId: string) {
  return useQuery({
    queryKey: ['gap-matches', gapId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gap_matches')
        .select(`
          *,
          agent:agents(*),
          workflow:workflow_packs(*),
          skill:skills(*)
        `)
        .eq('gap_id', gapId)
        .order('relevance_score', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!gapId,
  });
}

export function useCreateGap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gap: GapInsert) => {
      const { data, error } = await supabase
        .from('gaps')
        .insert(gap)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gaps'] });
    },
  });
}

export function useUpdateGap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: GapUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('gaps')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gaps'] });
      queryClient.invalidateQueries({ queryKey: ['gap', variables.id] });
    },
  });
}

export function useDeleteGap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gaps')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gaps'] });
    },
  });
}

export function useCreateGapMatches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matches: Database['public']['Tables']['gap_matches']['Insert'][]) => {
      const { data, error } = await supabase
        .from('gap_matches')
        .insert(matches)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['gap-matches', variables[0].gap_id] });
      }
    },
  });
}

// Statistics for dashboard
export function useGapStats() {
  return useQuery({
    queryKey: ['gap-stats'],
    queryFn: async () => {
      const { data: gaps, error } = await supabase
        .from('gaps')
        .select('status, decision');

      if (error) throw error;

      const total = gaps?.length || 0;
      const byStatus = gaps?.reduce((acc, gap) => {
        acc[gap.status] = (acc[gap.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const byDecision = gaps?.reduce((acc, gap) => {
        if (gap.decision) {
          acc[gap.decision] = (acc[gap.decision] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const decidedGaps = gaps?.filter(g => g.decision) || [];
      const decidedTotal = decidedGaps.length || 1;

      return {
        total,
        byStatus,
        byDecision,
        percentReuse: Math.round(((byDecision['Reuse existing agent'] || 0) / decidedTotal) * 100),
        percentExtend: Math.round(((byDecision['Extend existing agent or workflow'] || 0) / decidedTotal) * 100),
        percentBuild: Math.round(((byDecision['Build new agent'] || 0) / decidedTotal) * 100),
        percentDiscovery: Math.round(((byDecision['Discovery required'] || 0) / decidedTotal) * 100),
      };
    },
  });
}
