import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tool, Skill, Endpoint, AgentSkill, WorkflowSkill, ExecutionLane } from '@/types/agent';

// =====================================================
// TOOLS
// =====================================================

export function useTools() {
  return useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Tool[];
    },
  });
}

export function useTool(id: string) {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Tool;
    },
    enabled: !!id,
  });
}

// =====================================================
// SKILLS
// =====================================================

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          tool:tools(*)
        `)
        .order('name');

      if (error) throw error;
      return data as (Skill & { tool: Tool | null })[];
    },
  });
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: ['skill', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          tool:tools(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Skill & { tool: Tool | null };
    },
    enabled: !!id,
  });
}

export function useSkillsByTool(toolId: string) {
  return useQuery({
    queryKey: ['skills-by-tool', toolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('tool_id', toolId)
        .order('name');

      if (error) throw error;
      return data as Skill[];
    },
    enabled: !!toolId,
  });
}

// =====================================================
// ENDPOINTS
// =====================================================

export function useEndpoints() {
  return useQuery({
    queryKey: ['endpoints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('endpoints')
        .select(`
          *,
          skill:skills(*, tool:tools(*))
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
  });
}

export function useEndpointsBySkill(skillId: string) {
  return useQuery({
    queryKey: ['endpoints-by-skill', skillId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('endpoints')
        .select('*')
        .eq('skill_id', skillId)
        .order('execution_lane');

      if (error) throw error;
      return data as Endpoint[];
    },
    enabled: !!skillId,
  });
}

// =====================================================
// AGENT-SKILL RELATIONSHIPS
// =====================================================

export function useAgentSkills(agentId: string) {
  return useQuery({
    queryKey: ['agent-skills', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_skills')
        .select(`
          *,
          skill:skills(*, tool:tools(*))
        `)
        .eq('agent_id', agentId);

      if (error) throw error;
      return data as (AgentSkill & { skill: Skill & { tool: Tool | null } })[];
    },
    enabled: !!agentId,
  });
}

export function useSkillAgents(skillId: string) {
  return useQuery({
    queryKey: ['skill-agents', skillId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_skills')
        .select(`
          *,
          agent:agents(*)
        `)
        .eq('skill_id', skillId);

      if (error) throw error;
      return data;
    },
    enabled: !!skillId,
  });
}

// =====================================================
// WORKFLOW-SKILL RELATIONSHIPS
// =====================================================

export function useWorkflowSkills(workflowId: string) {
  return useQuery({
    queryKey: ['workflow-skills', workflowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_skills')
        .select(`
          *,
          skill:skills(*, tool:tools(*))
        `)
        .eq('workflow_id', workflowId);

      if (error) throw error;
      return data as (WorkflowSkill & { skill: Skill & { tool: Tool | null } })[];
    },
    enabled: !!workflowId,
  });
}

export function useSkillWorkflows(skillId: string) {
  return useQuery({
    queryKey: ['skill-workflows', skillId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_skills')
        .select(`
          *,
          workflow:workflow_packs(*)
        `)
        .eq('skill_id', skillId);

      if (error) throw error;
      return data;
    },
    enabled: !!skillId,
  });
}

// =====================================================
// ANALYTICS & AGGREGATIONS
// =====================================================

export function useToolsRegistryStats() {
  return useQuery({
    queryKey: ['tools-registry-stats'],
    queryFn: async () => {
      // Get all tools
      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('*');
      if (toolsError) throw toolsError;

      // Get all skills with usage counts
      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*');
      if (skillsError) throw skillsError;

      // Get all endpoints
      const { data: endpoints, error: endpointsError } = await supabase
        .from('endpoints')
        .select('*');
      if (endpointsError) throw endpointsError;

      // Get agent-skill relationships
      const { data: agentSkills, error: agentSkillsError } = await supabase
        .from('agent_skills')
        .select('skill_id');
      if (agentSkillsError) throw agentSkillsError;

      // Get workflow-skill relationships
      const { data: workflowSkills, error: workflowSkillsError } = await supabase
        .from('workflow_skills')
        .select('skill_id');
      if (workflowSkillsError) throw workflowSkillsError;

      // Count skill usage
      const skillUsage: Record<string, { agents: number; workflows: number }> = {};
      skills.forEach(skill => {
        skillUsage[skill.id] = { agents: 0, workflows: 0 };
      });
      agentSkills.forEach(as => {
        if (skillUsage[as.skill_id]) skillUsage[as.skill_id].agents++;
      });
      workflowSkills.forEach(ws => {
        if (skillUsage[ws.skill_id]) skillUsage[ws.skill_id].workflows++;
      });

      // Build coverage matrix
      const lanes: ExecutionLane[] = ['Quantum', 'Azure', 'GCP'];
      const coverageMatrix: Record<string, Record<ExecutionLane, Endpoint | null>> = {};
      skills.forEach(skill => {
        coverageMatrix[skill.id] = { Quantum: null, Azure: null, GCP: null };
      });
      endpoints.forEach(ep => {
        if (coverageMatrix[ep.skill_id]) {
          coverageMatrix[ep.skill_id][ep.execution_lane as ExecutionLane] = ep as Endpoint;
        }
      });

      return {
        tools: tools as Tool[],
        skills: skills as Skill[],
        endpoints: endpoints as Endpoint[],
        skillUsage,
        coverageMatrix,
        totalTools: tools.length,
        totalSkills: skills.length,
        totalEndpoints: endpoints.length,
        skillsByStatus: {
          Draft: skills.filter(s => s.status === 'Draft').length,
          Approved: skills.filter(s => s.status === 'Approved').length,
          Deprecated: skills.filter(s => s.status === 'Deprecated').length,
        },
        endpointsByHealth: {
          Healthy: endpoints.filter(e => e.health_status === 'Healthy').length,
          Degraded: endpoints.filter(e => e.health_status === 'Degraded').length,
          'At Risk': endpoints.filter(e => e.health_status === 'At Risk').length,
        },
      };
    },
  });
}
