import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AgentRating {
  agent_id: string;
  average_rating: number;
  feedback_count: number;
}

export function useAgentRatings() {
  return useQuery({
    queryKey: ['agent-ratings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('agent_id, rating')
        .not('agent_id', 'is', null)
        .not('rating', 'is', null);

      if (error) throw error;

      // Aggregate ratings by agent
      const ratingsByAgent: Record<string, { total: number; count: number }> = {};
      
      data.forEach(feedback => {
        if (!feedback.agent_id || feedback.rating === null) return;
        
        if (!ratingsByAgent[feedback.agent_id]) {
          ratingsByAgent[feedback.agent_id] = { total: 0, count: 0 };
        }
        ratingsByAgent[feedback.agent_id].total += feedback.rating;
        ratingsByAgent[feedback.agent_id].count += 1;
      });

      const result: Record<string, AgentRating> = {};
      Object.entries(ratingsByAgent).forEach(([agentId, stats]) => {
        result[agentId] = {
          agent_id: agentId,
          average_rating: stats.total / stats.count,
          feedback_count: stats.count,
        };
      });

      return result;
    },
  });
}

export function useAgentUtilization() {
  return useQuery({
    queryKey: ['agent-utilization'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usage_metrics')
        .select('agent_id, total_sessions')
        .not('agent_id', 'is', null);

      if (error) throw error;

      // Aggregate sessions by agent
      const sessionsByAgent: Record<string, number> = {};
      
      data.forEach(metric => {
        if (!metric.agent_id) return;
        sessionsByAgent[metric.agent_id] = (sessionsByAgent[metric.agent_id] || 0) + (metric.total_sessions || 0);
      });

      return sessionsByAgent;
    },
  });
}

export function useTopRatedAgents() {
  return useQuery({
    queryKey: ['top-rated-agents'],
    queryFn: async () => {
      // Get all feedback with ratings
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('agent_id, rating')
        .not('agent_id', 'is', null)
        .not('rating', 'is', null);

      if (feedbackError) throw feedbackError;

      // Get agent names
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, name');

      if (agentsError) throw agentsError;

      const agentMap = new Map(agents.map(a => [a.id, a.name]));

      // Aggregate ratings
      const ratingsByAgent: Record<string, { total: number; count: number }> = {};
      
      feedbackData.forEach(feedback => {
        if (!feedback.agent_id || feedback.rating === null) return;
        
        if (!ratingsByAgent[feedback.agent_id]) {
          ratingsByAgent[feedback.agent_id] = { total: 0, count: 0 };
        }
        ratingsByAgent[feedback.agent_id].total += feedback.rating;
        ratingsByAgent[feedback.agent_id].count += 1;
      });

      return Object.entries(ratingsByAgent)
        .map(([agentId, stats]) => ({
          name: agentMap.get(agentId) || 'Unknown Agent',
          rating: stats.total / stats.count,
          count: stats.count,
        }))
        .sort((a, b) => b.rating - a.rating);
    },
  });
}

export function useTopUtilizedAgents() {
  return useQuery({
    queryKey: ['top-utilized-agents'],
    queryFn: async () => {
      // Get all usage metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('usage_metrics')
        .select('agent_id, total_sessions')
        .not('agent_id', 'is', null);

      if (metricsError) throw metricsError;

      // Get agent names
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, name');

      if (agentsError) throw agentsError;

      const agentMap = new Map(agents.map(a => [a.id, a.name]));

      // Aggregate sessions
      const sessionsByAgent: Record<string, number> = {};
      
      metricsData.forEach(metric => {
        if (!metric.agent_id) return;
        sessionsByAgent[metric.agent_id] = (sessionsByAgent[metric.agent_id] || 0) + (metric.total_sessions || 0);
      });

      return Object.entries(sessionsByAgent)
        .map(([agentId, sessions]) => ({
          name: agentMap.get(agentId) || 'Unknown Agent',
          sessions,
        }))
        .sort((a, b) => b.sessions - a.sessions);
    },
  });
}
