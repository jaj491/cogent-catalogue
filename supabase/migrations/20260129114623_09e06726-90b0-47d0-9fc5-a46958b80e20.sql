-- Create usage_metrics_snapshot table for imported utilization data
CREATE TABLE public.usage_metrics_snapshot (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account TEXT NOT NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  agent_name TEXT,
  metric TEXT NOT NULL DEFAULT 'unique_users',
  value NUMERIC NOT NULL DEFAULT 0,
  time_window_start DATE NOT NULL,
  time_window_end DATE NOT NULL,
  data_source TEXT NOT NULL DEFAULT 'Adoption PPTX',
  notes TEXT,
  raw_agent_slug TEXT,
  match_confidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unmatched_usage_rows table for rows that couldn't be matched
CREATE TABLE public.unmatched_usage_rows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  metric TEXT NOT NULL DEFAULT 'unique_users',
  value NUMERIC NOT NULL DEFAULT 0,
  time_window_start DATE NOT NULL,
  time_window_end DATE NOT NULL,
  data_source TEXT NOT NULL DEFAULT 'Adoption PPTX',
  notes TEXT,
  raw_agent_slug TEXT,
  match_confidence TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent_aliases table for alias resolution
CREATE TABLE public.agent_aliases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alias_name TEXT NOT NULL,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(alias_name)
);

-- Enable RLS on all tables
ALTER TABLE public.usage_metrics_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unmatched_usage_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_aliases ENABLE ROW LEVEL SECURITY;

-- RLS policies for usage_metrics_snapshot
CREATE POLICY "Usage metrics snapshot viewable by authenticated" 
ON public.usage_metrics_snapshot 
FOR SELECT 
USING (true);

CREATE POLICY "Usage metrics snapshot manageable by admins and owners" 
ON public.usage_metrics_snapshot 
FOR ALL 
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));

-- RLS policies for unmatched_usage_rows
CREATE POLICY "Unmatched usage rows viewable by authenticated" 
ON public.unmatched_usage_rows 
FOR SELECT 
USING (true);

CREATE POLICY "Unmatched usage rows manageable by admins" 
ON public.unmatched_usage_rows 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for agent_aliases
CREATE POLICY "Agent aliases viewable by authenticated" 
ON public.agent_aliases 
FOR SELECT 
USING (true);

CREATE POLICY "Agent aliases manageable by admins and owners" 
ON public.agent_aliases 
FOR ALL 
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));

-- Create index for faster lookups
CREATE INDEX idx_usage_metrics_snapshot_agent_id ON public.usage_metrics_snapshot(agent_id);
CREATE INDEX idx_usage_metrics_snapshot_account ON public.usage_metrics_snapshot(account);
CREATE INDEX idx_usage_metrics_snapshot_metric ON public.usage_metrics_snapshot(metric);
CREATE INDEX idx_unmatched_usage_rows_resolved ON public.unmatched_usage_rows(resolved);
CREATE INDEX idx_agent_aliases_alias_name ON public.agent_aliases(alias_name);