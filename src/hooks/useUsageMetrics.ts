import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UsageMetricsSnapshot {
  id: string;
  account: string;
  agent_id: string | null;
  agent_name: string | null;
  metric: string;
  value: number;
  time_window_start: string;
  time_window_end: string;
  data_source: string;
  notes: string | null;
  raw_agent_slug: string | null;
  match_confidence: string | null;
  created_at: string;
}

export interface UnmatchedUsageRow {
  id: string;
  account: string;
  agent_name: string;
  metric: string;
  value: number;
  time_window_start: string;
  time_window_end: string;
  data_source: string;
  notes: string | null;
  raw_agent_slug: string | null;
  match_confidence: string | null;
  resolved: boolean;
  resolved_agent_id: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export interface AgentAlias {
  id: string;
  alias_name: string;
  agent_id: string;
  created_by: string | null;
  created_at: string;
}

// Fetch all usage metrics snapshots
export function useUsageMetricsSnapshots() {
  return useQuery({
    queryKey: ['usage-metrics-snapshots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usage_metrics_snapshot')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UsageMetricsSnapshot[];
    },
  });
}

// Fetch usage metrics for a specific agent
export function useAgentUsageMetrics(agentId: string | undefined) {
  return useQuery({
    queryKey: ['agent-usage-metrics', agentId],
    queryFn: async () => {
      if (!agentId) return [];
      const { data, error } = await supabase
        .from('usage_metrics_snapshot')
        .select('*')
        .eq('agent_id', agentId)
        .order('time_window_end', { ascending: false });
      
      if (error) throw error;
      return data as UsageMetricsSnapshot[];
    },
    enabled: !!agentId,
  });
}

// Fetch top agents by unique users (most recent window)
export function useTopAgentsByUniqueUsers(limit = 10) {
  return useQuery({
    queryKey: ['top-agents-unique-users', limit],
    queryFn: async () => {
      // Get the most recent time_window_end
      const { data: latestWindow, error: windowError } = await supabase
        .from('usage_metrics_snapshot')
        .select('time_window_end')
        .order('time_window_end', { ascending: false })
        .limit(1);
      
      if (windowError) throw windowError;
      if (!latestWindow || latestWindow.length === 0) return [];

      const latestEnd = latestWindow[0].time_window_end;

      // Get top agents by unique_users for this window
      const { data, error } = await supabase
        .from('usage_metrics_snapshot')
        .select(`
          *,
          agents!inner(id, name)
        `)
        .eq('metric', 'unique_users')
        .eq('time_window_end', latestEnd)
        .order('value', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
}

// Fetch unmatched usage rows
export function useUnmatchedUsageRows() {
  return useQuery({
    queryKey: ['unmatched-usage-rows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unmatched_usage_rows')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UnmatchedUsageRow[];
    },
  });
}

// Fetch agent aliases
export function useAgentAliases() {
  return useQuery({
    queryKey: ['agent-aliases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_aliases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AgentAlias[];
    },
  });
}

// Resolve an unmatched row
export function useResolveUnmatchedRow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ rowId, agentId, agentName, createAlias }: { 
      rowId: string; 
      agentId: string; 
      agentName: string;
      createAlias: boolean;
    }) => {
      // Get the unmatched row
      const { data: unmatchedRow, error: fetchError } = await supabase
        .from('unmatched_usage_rows')
        .select('*')
        .eq('id', rowId)
        .single();
      
      if (fetchError) throw fetchError;

      // Insert into usage_metrics_snapshot
      const { error: insertError } = await supabase
        .from('usage_metrics_snapshot')
        .insert({
          account: unmatchedRow.account,
          agent_id: agentId,
          agent_name: agentName,
          metric: unmatchedRow.metric,
          value: unmatchedRow.value,
          time_window_start: unmatchedRow.time_window_start,
          time_window_end: unmatchedRow.time_window_end,
          data_source: unmatchedRow.data_source,
          notes: unmatchedRow.notes,
          raw_agent_slug: unmatchedRow.raw_agent_slug,
          match_confidence: 'Manual',
        });
      
      if (insertError) throw insertError;

      // Mark as resolved
      const { error: updateError } = await supabase
        .from('unmatched_usage_rows')
        .update({
          resolved: true,
          resolved_agent_id: agentId,
          resolved_at: new Date().toISOString(),
          resolved_by: 'Admin',
        })
        .eq('id', rowId);
      
      if (updateError) throw updateError;

      // Optionally create alias for future imports
      if (createAlias) {
        const { error: aliasError } = await supabase
          .from('agent_aliases')
          .insert({
            alias_name: unmatchedRow.agent_name,
            agent_id: agentId,
            created_by: 'Admin',
          });
        
        // Ignore unique constraint violations (alias already exists)
        if (aliasError && !aliasError.message.includes('duplicate')) {
          throw aliasError;
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unmatched-usage-rows'] });
      queryClient.invalidateQueries({ queryKey: ['usage-metrics-snapshots'] });
      queryClient.invalidateQueries({ queryKey: ['agent-aliases'] });
      queryClient.invalidateQueries({ queryKey: ['top-agents-unique-users'] });
    },
  });
}

// Bulk insert usage metrics (for CSV import)
export function useImportUsageMetrics() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rows: Array<{
      account: string;
      agent_name: string;
      metric: string;
      value: number;
      time_window_start: string;
      time_window_end: string;
      data_source?: string;
      raw_agent_slug?: string;
      match_confidence?: string;
    }>) => {
      // Fetch all agents for matching
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, name');
      
      if (agentsError) throw agentsError;

      // Fetch all aliases for matching
      const { data: aliases, error: aliasesError } = await supabase
        .from('agent_aliases')
        .select('alias_name, agent_id');
      
      if (aliasesError) throw aliasesError;

      const matched: Array<{
        account: string;
        agent_id: string;
        agent_name: string;
        metric: string;
        value: number;
        time_window_start: string;
        time_window_end: string;
        data_source: string;
        raw_agent_slug: string | null;
        match_confidence: string | null;
      }> = [];
      
      const unmatched: Array<{
        account: string;
        agent_name: string;
        metric: string;
        value: number;
        time_window_start: string;
        time_window_end: string;
        data_source: string;
        raw_agent_slug: string | null;
        match_confidence: string | null;
      }> = [];

      for (const row of rows) {
        // Try to match agent by name (case-insensitive)
        let matchedAgent = agents?.find(
          a => a.name.toLowerCase() === row.agent_name.toLowerCase()
        );

        // If no match, try aliases
        if (!matchedAgent) {
          const alias = aliases?.find(
            a => a.alias_name.toLowerCase() === row.agent_name.toLowerCase()
          );
          if (alias) {
            matchedAgent = agents?.find(a => a.id === alias.agent_id);
          }
        }

        if (matchedAgent) {
          matched.push({
            account: row.account,
            agent_id: matchedAgent.id,
            agent_name: matchedAgent.name,
            metric: row.metric,
            value: row.value,
            time_window_start: row.time_window_start,
            time_window_end: row.time_window_end,
            data_source: row.data_source || 'Adoption PPTX',
            raw_agent_slug: row.raw_agent_slug || null,
            match_confidence: row.match_confidence || 'Auto',
          });
        } else {
          unmatched.push({
            account: row.account,
            agent_name: row.agent_name,
            metric: row.metric,
            value: row.value,
            time_window_start: row.time_window_start,
            time_window_end: row.time_window_end,
            data_source: row.data_source || 'Adoption PPTX',
            raw_agent_slug: row.raw_agent_slug || null,
            match_confidence: row.match_confidence || null,
          });
        }
      }

      // Insert matched rows
      if (matched.length > 0) {
        const { error: matchedError } = await supabase
          .from('usage_metrics_snapshot')
          .insert(matched);
        
        if (matchedError) throw matchedError;
      }

      // Insert unmatched rows
      if (unmatched.length > 0) {
        const { error: unmatchedError } = await supabase
          .from('unmatched_usage_rows')
          .insert(unmatched);
        
        if (unmatchedError) throw unmatchedError;
      }

      return {
        matched: matched.length,
        unmatched: unmatched.length,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage-metrics-snapshots'] });
      queryClient.invalidateQueries({ queryKey: ['unmatched-usage-rows'] });
      queryClient.invalidateQueries({ queryKey: ['top-agents-unique-users'] });
      queryClient.invalidateQueries({ queryKey: ['import-history'] });
    },
  });
}
