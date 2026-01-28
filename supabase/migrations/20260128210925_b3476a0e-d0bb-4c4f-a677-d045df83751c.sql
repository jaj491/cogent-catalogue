-- GEP Agent Hub Database Schema

-- ================================
-- ENUMS for controlled vocabularies
-- ================================

-- Agent types
CREATE TYPE public.agent_type AS ENUM (
  'General',
  'Sourcing', 
  'Contracting',
  'PR2PO',
  'AP',
  'Compliance'
);

-- Platform types
CREATE TYPE public.platform_type AS ENUM (
  'Quantum Studio',
  'Quantum Platform',
  'Google Agentspace',
  'Microsoft Co-Pilot Studio',
  'Others'
);

-- Hosted in types
CREATE TYPE public.hosted_in_type AS ENUM (
  'GEP AI Agent Library',
  'Internal Domain',
  'Client Domain',
  'Client Environment'
);

-- Status types (lifecycle)
CREATE TYPE public.agent_status AS ENUM (
  'Ideation',
  'In Progress',
  'UAT',
  'Governance Review',
  'Deployable',
  'Deployed',
  'Archived'
);

-- Function domains
CREATE TYPE public.function_domain_type AS ENUM (
  'S2C',
  'P2P',
  'AP',
  'SCM',
  'MDM',
  'Consulting',
  'FHV'
);

-- Owner team types
CREATE TYPE public.owner_team_type AS ENUM (
  'Digital COE',
  'Account',
  'Central AI Services',
  'AI Agent Champions',
  'Other'
);

-- Workflow maturity levels
CREATE TYPE public.maturity_type AS ENUM (
  'Prototype',
  'Pilot',
  'Production'
);

-- Deployment rollout status
CREATE TYPE public.rollout_status_type AS ENUM (
  'Planned',
  'In UAT',
  'Live',
  'Paused',
  'Decommissioned'
);

-- Deployment target type
CREATE TYPE public.target_type AS ENUM (
  'Internal',
  'Client'
);

-- Integration depth
CREATE TYPE public.integration_depth_type AS ENUM (
  'None',
  'Minimal',
  'Standard connectors',
  'Custom APIs'
);

-- Feedback sentiment
CREATE TYPE public.sentiment_type AS ENUM (
  'positive',
  'negative'
);

-- Feedback category
CREATE TYPE public.feedback_category AS ENUM (
  'Accuracy',
  'Usefulness',
  'UX',
  'Integration',
  'Policy/Compliance',
  'Other'
);

-- Feedback status
CREATE TYPE public.feedback_status AS ENUM (
  'New',
  'Triaged',
  'In Fix',
  'Resolved',
  'Wont Fix'
);

-- Defect severity
CREATE TYPE public.defect_severity AS ENUM (
  'Critical',
  'High',
  'Medium',
  'Low'
);

-- Defect root cause
CREATE TYPE public.root_cause_category AS ENUM (
  'Prompt',
  'Data',
  'Connector',
  'Model',
  'Access',
  'Policy',
  'Other'
);

-- Tool types
CREATE TYPE public.tool_type AS ENUM (
  'API',
  'Connector',
  'MCP endpoint',
  'Script',
  'RPA',
  'Database',
  'Other'
);

-- User roles
CREATE TYPE public.app_role AS ENUM (
  'viewer',
  'account_lead',
  'agent_owner',
  'admin'
);

-- ================================
-- CORE TABLES
-- ================================

-- Agents table (the core asset)
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  agent_type agent_type NOT NULL DEFAULT 'General',
  platform platform_type NOT NULL DEFAULT 'Quantum Studio',
  hosted_in hosted_in_type NOT NULL DEFAULT 'Internal Domain',
  status agent_status NOT NULL DEFAULT 'Ideation',
  function_domains function_domain_type[] DEFAULT '{}',
  sub_functions TEXT[] DEFAULT '{}',
  owner_primary TEXT,
  owner_team owner_team_type DEFAULT 'Other',
  documentation_links TEXT[] DEFAULT '{}',
  demo_assets TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  completion_percentage INTEGER,
  can_be_marketed BOOLEAN DEFAULT false,
  can_be_demoed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workflow Packs table
CREATE TABLE public.workflow_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  problem_statement TEXT,
  business_outcome TEXT,
  process_area function_domain_type,
  triggers TEXT[] DEFAULT '{}',
  systems TEXT[] DEFAULT '{}',
  orchestrator TEXT,
  description TEXT,
  stages JSONB DEFAULT '[]',
  owners TEXT[] DEFAULT '{}',
  smes TEXT[] DEFAULT '{}',
  maturity maturity_type DEFAULT 'Prototype',
  reusable_pattern_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction table for workflow-agent relationships
CREATE TABLE public.workflow_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflow_packs(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  stage_order INTEGER DEFAULT 0,
  role_in_workflow TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workflow_id, agent_id)
);

-- Deployment instances
CREATE TABLE public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type target_type NOT NULL DEFAULT 'Internal',
  client_name TEXT,
  environment hosted_in_type NOT NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  workflow_id UUID REFERENCES public.workflow_packs(id) ON DELETE SET NULL,
  version_label TEXT DEFAULT 'v1.0',
  go_live_date_planned DATE,
  go_live_date_actual DATE,
  rollout_status rollout_status_type DEFAULT 'Planned',
  configuration_notes TEXT,
  integration_depth integration_depth_type DEFAULT 'None',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT deployment_has_agent_or_workflow CHECK (agent_id IS NOT NULL OR workflow_id IS NOT NULL)
);

-- Usage Metrics Snapshots
CREATE TABLE public.usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES public.workflow_packs(id) ON DELETE CASCADE,
  time_window_start TIMESTAMPTZ NOT NULL,
  time_window_end TIMESTAMPTZ NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  successful_interactions INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  avg_interaction_time_seconds NUMERIC,
  avg_turns NUMERIC,
  containment_rate NUMERIC,
  escalation_rate NUMERIC,
  feedback_count INTEGER DEFAULT 0,
  correction_count INTEGER DEFAULT 0,
  north_star_score NUMERIC,
  data_source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT usage_has_agent_or_workflow CHECK (agent_id IS NOT NULL OR workflow_id IS NOT NULL)
);

-- Feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES public.workflow_packs(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES public.deployments(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  sentiment sentiment_type,
  category feedback_category DEFAULT 'Other',
  comment TEXT,
  created_by TEXT,
  status feedback_status DEFAULT 'New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT feedback_has_agent_or_workflow CHECK (agent_id IS NOT NULL OR workflow_id IS NOT NULL)
);

-- Defects/Regressions
CREATE TABLE public.defects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES public.workflow_packs(id) ON DELETE CASCADE,
  severity defect_severity DEFAULT 'Medium',
  environment_impacted TEXT,
  client_impacted TEXT,
  description TEXT NOT NULL,
  root_cause root_cause_category,
  status TEXT DEFAULT 'Open',
  fix_owner TEXT,
  ticket_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT defect_has_agent_or_workflow CHECK (agent_id IS NOT NULL OR workflow_id IS NOT NULL)
);

-- Connectors/Tools Registry
CREATE TABLE public.connectors_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tool_type tool_type DEFAULT 'API',
  owner_team TEXT,
  notes TEXT,
  reusability_rating INTEGER CHECK (reusability_rating >= 1 AND reusability_rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction for agent-tool relationships
CREATE TABLE public.agent_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.connectors_tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(agent_id, tool_id)
);

-- Junction for workflow-tool relationships
CREATE TABLE public.workflow_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflow_packs(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.connectors_tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workflow_id, tool_id)
);

-- Ideas/Gap Finder
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_statement TEXT NOT NULL,
  expected_value TEXT,
  required_data TEXT,
  target_accounts TEXT[] DEFAULT '{}',
  decision_status TEXT DEFAULT 'Needs Discovery',
  priority INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Governance Gates
CREATE TABLE public.governance_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES public.workflow_packs(id) ON DELETE CASCADE,
  gate_name TEXT NOT NULL,
  gate_owner TEXT,
  required_artifacts TEXT[] DEFAULT '{}',
  passed BOOLEAN DEFAULT false,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT gate_has_agent_or_workflow CHECK (agent_id IS NOT NULL OR workflow_id IS NOT NULL)
);

-- Import History
CREATE TABLE public.import_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  records_imported INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  imported_by TEXT,
  import_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Audit log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================
-- SECURITY DEFINER FUNCTIONS
-- ================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  )
$$;

-- ================================
-- ROW LEVEL SECURITY
-- ================================

-- Enable RLS on all tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connectors_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Agents policies (readable by all authenticated, writable by owners/admins)
CREATE POLICY "Agents are viewable by all authenticated users"
  ON public.agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can be created by admins and agent owners"
  ON public.agents FOR INSERT
  TO authenticated
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

CREATE POLICY "Agents can be updated by admins and agent owners"
  ON public.agents FOR UPDATE
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

CREATE POLICY "Agents can be deleted by admins"
  ON public.agents FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Workflow packs policies
CREATE POLICY "Workflows are viewable by all authenticated users"
  ON public.workflow_packs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Workflows can be created by admins and agent owners"
  ON public.workflow_packs FOR INSERT
  TO authenticated
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

CREATE POLICY "Workflows can be updated by admins and agent owners"
  ON public.workflow_packs FOR UPDATE
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

CREATE POLICY "Workflows can be deleted by admins"
  ON public.workflow_packs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Workflow agents junction policies
CREATE POLICY "Workflow agents viewable by authenticated"
  ON public.workflow_agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Workflow agents manageable by admins and owners"
  ON public.workflow_agents FOR ALL
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

-- Deployments policies
CREATE POLICY "Deployments viewable by authenticated"
  ON public.deployments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Deployments can be proposed by account leads and above"
  ON public.deployments FOR INSERT
  TO authenticated
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner', 'account_lead']::app_role[]));

CREATE POLICY "Deployments can be updated by admins and owners"
  ON public.deployments FOR UPDATE
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

CREATE POLICY "Deployments can be deleted by admins"
  ON public.deployments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Usage metrics policies
CREATE POLICY "Usage metrics viewable by authenticated"
  ON public.usage_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usage metrics manageable by admins and owners"
  ON public.usage_metrics FOR ALL
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

-- Feedback policies
CREATE POLICY "Feedback viewable by authenticated"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Feedback can be added by all authenticated"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Feedback can be updated by admins and owners"
  ON public.feedback FOR UPDATE
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

-- Defects policies
CREATE POLICY "Defects viewable by authenticated"
  ON public.defects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Defects manageable by admins and owners"
  ON public.defects FOR ALL
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

-- Connectors/Tools policies
CREATE POLICY "Tools viewable by authenticated"
  ON public.connectors_tools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Tools manageable by admins"
  ON public.connectors_tools FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Agent tools junction
CREATE POLICY "Agent tools viewable by authenticated"
  ON public.agent_tools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agent tools manageable by admins and owners"
  ON public.agent_tools FOR ALL
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

-- Workflow tools junction
CREATE POLICY "Workflow tools viewable by authenticated"
  ON public.workflow_tools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Workflow tools manageable by admins and owners"
  ON public.workflow_tools FOR ALL
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'agent_owner']::app_role[]));

-- Ideas policies
CREATE POLICY "Ideas viewable by authenticated"
  ON public.ideas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Ideas can be created by all authenticated"
  ON public.ideas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Ideas manageable by admins"
  ON public.ideas FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Governance gates policies
CREATE POLICY "Gates viewable by authenticated"
  ON public.governance_gates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gates manageable by admins"
  ON public.governance_gates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Import history policies
CREATE POLICY "Import history viewable by authenticated"
  ON public.import_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Import history manageable by admins"
  ON public.import_history FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Audit log policies
CREATE POLICY "Audit log viewable by admins"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Audit log insertable by authenticated"
  ON public.audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ================================
-- TRIGGERS FOR TIMESTAMPS
-- ================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_packs_updated_at
  BEFORE UPDATE ON public.workflow_packs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at
  BEFORE UPDATE ON public.deployments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_defects_updated_at
  BEFORE UPDATE ON public.defects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_connectors_tools_updated_at
  BEFORE UPDATE ON public.connectors_tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

CREATE INDEX idx_agents_status ON public.agents(status);
CREATE INDEX idx_agents_platform ON public.agents(platform);
CREATE INDEX idx_agents_agent_type ON public.agents(agent_type);
CREATE INDEX idx_agents_hosted_in ON public.agents(hosted_in);
CREATE INDEX idx_agents_function_domains ON public.agents USING GIN(function_domains);
CREATE INDEX idx_agents_tags ON public.agents USING GIN(tags);

CREATE INDEX idx_deployments_agent ON public.deployments(agent_id);
CREATE INDEX idx_deployments_workflow ON public.deployments(workflow_id);
CREATE INDEX idx_deployments_status ON public.deployments(rollout_status);

CREATE INDEX idx_usage_metrics_agent ON public.usage_metrics(agent_id);
CREATE INDEX idx_usage_metrics_workflow ON public.usage_metrics(workflow_id);
CREATE INDEX idx_usage_metrics_time ON public.usage_metrics(time_window_start, time_window_end);

CREATE INDEX idx_feedback_agent ON public.feedback(agent_id);
CREATE INDEX idx_feedback_workflow ON public.feedback(workflow_id);
CREATE INDEX idx_feedback_status ON public.feedback(status);

CREATE INDEX idx_defects_agent ON public.defects(agent_id);
CREATE INDEX idx_defects_workflow ON public.defects(workflow_id);
CREATE INDEX idx_defects_severity ON public.defects(severity);