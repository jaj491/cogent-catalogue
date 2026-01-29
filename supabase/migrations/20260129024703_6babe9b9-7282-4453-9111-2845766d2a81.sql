-- Create enum for gap status
CREATE TYPE gap_status AS ENUM ('New', 'In Review', 'Decision Made', 'In Build', 'Closed');

-- Create enum for gap triggering context
CREATE TYPE gap_trigger AS ENUM ('Client request', 'Sales pursuit', 'Delivery pain point', 'Internal innovation', 'Platform limitation');

-- Create enum for urgency level
CREATE TYPE urgency_level AS ENUM ('Low', 'Medium', 'High');

-- Create enum for impact level
CREATE TYPE impact_level AS ENUM ('Low', 'Medium', 'High');

-- Create enum for gap decision
CREATE TYPE gap_decision AS ENUM ('Reuse existing agent', 'Extend existing agent or workflow', 'Build new agent', 'Discovery required');

-- Create enum for suggested action
CREATE TYPE suggested_action AS ENUM ('Reuse', 'Extend', 'Partial Fit');

-- Create enum for match type
CREATE TYPE match_type AS ENUM ('agent', 'workflow', 'skill');

-- Create gaps table
CREATE TABLE public.gaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  desired_outcome TEXT,
  process_area public.function_domain_type,
  sub_functions TEXT[] DEFAULT '{}',
  triggering_context gap_trigger,
  target_clients TEXT[] DEFAULT '{}',
  urgency urgency_level DEFAULT 'Medium',
  estimated_impact impact_level DEFAULT 'Medium',
  status gap_status DEFAULT 'New',
  recommended_path TEXT,
  decision gap_decision,
  decision_rationale TEXT,
  decision_owner TEXT,
  next_steps TEXT,
  linked_artifact_id UUID,
  linked_artifact_type TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gap_matches table for storing automated matching results
CREATE TABLE public.gap_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gap_id UUID NOT NULL REFERENCES public.gaps(id) ON DELETE CASCADE,
  match_type match_type NOT NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES public.workflow_packs(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  relevance_score NUMERIC(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  suggested_action suggested_action,
  gap_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on gaps
ALTER TABLE public.gaps ENABLE ROW LEVEL SECURITY;

-- Gaps viewable by authenticated users
CREATE POLICY "Gaps viewable by authenticated" 
ON public.gaps 
FOR SELECT 
USING (true);

-- Gaps can be created by all authenticated users
CREATE POLICY "Gaps can be created by authenticated" 
ON public.gaps 
FOR INSERT 
WITH CHECK (true);

-- Gaps can be updated by admins and agent owners
CREATE POLICY "Gaps can be updated by admins and owners" 
ON public.gaps 
FOR UPDATE 
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));

-- Gaps can be deleted by admins
CREATE POLICY "Gaps can be deleted by admins" 
ON public.gaps 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on gap_matches
ALTER TABLE public.gap_matches ENABLE ROW LEVEL SECURITY;

-- Gap matches viewable by authenticated users
CREATE POLICY "Gap matches viewable by authenticated" 
ON public.gap_matches 
FOR SELECT 
USING (true);

-- Gap matches manageable by admins and owners
CREATE POLICY "Gap matches manageable by admins and owners" 
ON public.gap_matches 
FOR ALL 
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));

-- Create updated_at trigger for gaps
CREATE TRIGGER update_gaps_updated_at
BEFORE UPDATE ON public.gaps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();