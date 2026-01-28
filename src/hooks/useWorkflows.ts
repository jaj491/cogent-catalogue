import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { WorkflowPack, WorkflowAgent, WorkflowStage } from '@/types/agent';

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_packs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform stages from JSONB to proper type
      return (data || []).map(workflow => ({
        ...workflow,
        stages: (workflow.stages as unknown as WorkflowStage[]) || [],
      })) as WorkflowPack[];
    },
  });
}

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_packs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        stages: (data.stages as unknown as WorkflowStage[]) || [],
      } as WorkflowPack;
    },
    enabled: !!id,
  });
}

export function useWorkflowAgents(workflowId: string) {
  return useQuery({
    queryKey: ['workflow-agents', workflowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_agents')
        .select(`
          *,
          agent:agents(*)
        `)
        .eq('workflow_id', workflowId)
        .order('stage_order', { ascending: true });

      if (error) throw error;
      return data as (WorkflowAgent & { agent: any })[];
    },
    enabled: !!workflowId,
  });
}

export function useAgentWorkflows(agentId: string) {
  return useQuery({
    queryKey: ['agent-workflows', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_agents')
        .select(`
          *,
          workflow:workflow_packs(*)
        `)
        .eq('agent_id', agentId);

      if (error) throw error;
      
      return (data || []).map(wa => ({
        ...wa.workflow,
        stages: (wa.workflow?.stages as unknown as WorkflowStage[]) || [],
        role_in_workflow: wa.role_in_workflow,
      })) as (WorkflowPack & { role_in_workflow: string | null })[];
    },
    enabled: !!agentId,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflow: Omit<WorkflowPack, 'id' | 'created_at' | 'updated_at'>) => {
      const { stages, ...rest } = workflow;
      const insertData = {
        ...rest,
        stages: JSON.parse(JSON.stringify(stages)),
      };
      const { data, error } = await supabase
        .from('workflow_packs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useAddAgentToWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workflowId, agentId, stageOrder, roleInWorkflow }: {
      workflowId: string;
      agentId: string;
      stageOrder?: number;
      roleInWorkflow?: string;
    }) => {
      const { data, error } = await supabase
        .from('workflow_agents')
        .insert({
          workflow_id: workflowId,
          agent_id: agentId,
          stage_order: stageOrder || 0,
          role_in_workflow: roleInWorkflow,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflow-agents', variables.workflowId] });
      queryClient.invalidateQueries({ queryKey: ['agent-workflows', variables.agentId] });
    },
  });
}
