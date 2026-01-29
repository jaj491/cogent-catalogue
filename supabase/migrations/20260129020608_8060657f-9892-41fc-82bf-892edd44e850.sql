-- Create new enums for the Tools/Skills/Endpoints architecture

-- System type for Tools
CREATE TYPE system_type AS ENUM (
  'ERP',
  'CLM',
  'P2P',
  'Intake',
  'Collaboration',
  'Data',
  'AI',
  'RPA'
);

-- Authentication method
CREATE TYPE auth_method AS ENUM (
  'OAuth',
  'SSO/SAML',
  'API Key',
  'Service Principal'
);

-- Data sensitivity level
CREATE TYPE data_sensitivity AS ENUM (
  'Low',
  'Medium',
  'High'
);

-- Execution lane (platform)
CREATE TYPE execution_lane AS ENUM (
  'Quantum',
  'Azure',
  'GCP'
);

-- Skill capability category
CREATE TYPE capability_category AS ENUM (
  'Read',
  'Write',
  'Approve',
  'Search',
  'Extract',
  'Generate',
  'Compare'
);

-- Risk level
CREATE TYPE risk_level AS ENUM (
  'Low',
  'Medium',
  'High'
);

-- Skill status
CREATE TYPE skill_status AS ENUM (
  'Draft',
  'Approved',
  'Deprecated'
);

-- Implementation type for endpoints
CREATE TYPE implementation_type AS ENUM (
  'Qi Function',
  'Power Automate',
  'REST API',
  'MCP Tool',
  'Cloud Function'
);

-- Environment type
CREATE TYPE environment_type AS ENUM (
  'Dev',
  'Test',
  'Prod'
);

-- Observability provider
CREATE TYPE observability_type AS ENUM (
  'Langfuse',
  'Other',
  'None'
);

-- Health status
CREATE TYPE health_status AS ENUM (
  'Healthy',
  'Degraded',
  'At Risk'
);

-- =====================================================
-- TOOLS TABLE (System-level)
-- =====================================================
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  system_type system_type NOT NULL,
  vendor TEXT,
  auth_method auth_method,
  data_sensitivity data_sensitivity DEFAULT 'Medium',
  supported_lanes execution_lane[] DEFAULT '{}',
  owner_team TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tools
CREATE POLICY "Tools viewable by authenticated" 
ON public.tools FOR SELECT 
USING (true);

CREATE POLICY "Tools manageable by admins" 
ON public.tools FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger
CREATE TRIGGER update_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SKILLS TABLE (Reusable capability)
-- =====================================================
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  capability_category capability_category NOT NULL,
  description TEXT,
  inputs TEXT,
  outputs TEXT,
  risk_level risk_level DEFAULT 'Low',
  reusability_rating INTEGER CHECK (reusability_rating >= 1 AND reusability_rating <= 5),
  status skill_status DEFAULT 'Draft',
  owner TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skills
CREATE POLICY "Skills viewable by authenticated" 
ON public.skills FOR SELECT 
USING (true);

CREATE POLICY "Skills manageable by admins and owners" 
ON public.skills FOR ALL 
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));

-- Update trigger
CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ENDPOINTS TABLE (Platform-specific implementation)
-- =====================================================
CREATE TABLE public.endpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  execution_lane execution_lane NOT NULL,
  implementation_type implementation_type NOT NULL,
  endpoint_reference TEXT,
  environment environment_type DEFAULT 'Dev',
  observability observability_type DEFAULT 'None',
  health_status health_status DEFAULT 'Healthy',
  last_tested_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.endpoints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for endpoints
CREATE POLICY "Endpoints viewable by authenticated" 
ON public.endpoints FOR SELECT 
USING (true);

CREATE POLICY "Endpoints manageable by admins and owners" 
ON public.endpoints FOR ALL 
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));

-- Update trigger
CREATE TRIGGER update_endpoints_updated_at
BEFORE UPDATE ON public.endpoints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- AGENT_SKILLS JOIN TABLE
-- =====================================================
CREATE TABLE public.agent_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id, skill_id)
);

-- Enable RLS
ALTER TABLE public.agent_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Agent skills viewable by authenticated" 
ON public.agent_skills FOR SELECT 
USING (true);

CREATE POLICY "Agent skills manageable by admins and owners" 
ON public.agent_skills FOR ALL 
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));

-- =====================================================
-- WORKFLOW_SKILLS JOIN TABLE
-- =====================================================
CREATE TABLE public.workflow_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflow_packs(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  stage_in_workflow TEXT,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workflow_id, skill_id)
);

-- Enable RLS
ALTER TABLE public.workflow_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Workflow skills viewable by authenticated" 
ON public.workflow_skills FOR SELECT 
USING (true);

CREATE POLICY "Workflow skills manageable by admins and owners" 
ON public.workflow_skills FOR ALL 
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));