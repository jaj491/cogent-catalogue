// GEP Agent Hub Type Definitions

export type AgentType = 'General' | 'Sourcing' | 'Contracting' | 'PR2PO' | 'AP' | 'Compliance';

export type PlatformType = 
  | 'Quantum Studio' 
  | 'Quantum Platform' 
  | 'Google Agentspace' 
  | 'Microsoft Co-Pilot Studio' 
  | 'Others';

export type HostedInType = 
  | 'GEP AI Agent Library' 
  | 'Internal Domain' 
  | 'Client Domain' 
  | 'Client Environment';

export type AgentStatus = 
  | 'Ideation' 
  | 'In Progress' 
  | 'UAT' 
  | 'Governance Review' 
  | 'Deployable' 
  | 'Deployed' 
  | 'Archived';

export type FunctionDomainType = 'S2C' | 'P2P' | 'AP' | 'SCM' | 'MDM' | 'Consulting' | 'FHV';

export type OwnerTeamType = 'Digital COE' | 'Account' | 'Central AI Services' | 'AI Agent Champions' | 'Other';

export type MaturityType = 'Prototype' | 'Pilot' | 'Production';

export type RolloutStatusType = 'Planned' | 'In UAT' | 'Live' | 'Paused' | 'Decommissioned';

export type TargetType = 'Internal' | 'Client';

export type IntegrationDepthType = 'None' | 'Minimal' | 'Standard connectors' | 'Custom APIs';

export type SentimentType = 'positive' | 'negative';

export type FeedbackCategory = 'Accuracy' | 'Usefulness' | 'UX' | 'Integration' | 'Policy/Compliance' | 'Other';

export type FeedbackStatusType = 'New' | 'Triaged' | 'In Fix' | 'Resolved' | 'Wont Fix';

export type DefectSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type RootCauseCategory = 'Prompt' | 'Data' | 'Connector' | 'Model' | 'Access' | 'Policy' | 'Other';

export type ToolType = 'API' | 'Connector' | 'MCP endpoint' | 'Script' | 'RPA' | 'Database' | 'Other';

export type AppRole = 'viewer' | 'account_lead' | 'agent_owner' | 'admin';

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  agent_type: AgentType;
  platform: PlatformType;
  hosted_in: HostedInType;
  status: AgentStatus;
  function_domains: FunctionDomainType[];
  sub_functions: string[];
  owner_primary: string | null;
  owner_team: OwnerTeamType | null;
  documentation_links: string[];
  demo_assets: string[];
  tags: string[];
  notes: string | null;
  completion_percentage: number | null;
  can_be_marketed: boolean;
  can_be_demoed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowPack {
  id: string;
  name: string;
  problem_statement: string | null;
  business_outcome: string | null;
  process_area: FunctionDomainType | null;
  triggers: string[];
  systems: string[];
  orchestrator: string | null;
  description: string | null;
  stages: WorkflowStage[];
  owners: string[];
  smes: string[];
  maturity: MaturityType;
  reusable_pattern_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowStage {
  order: number;
  name: string;
  type: 'trigger' | 'orchestration' | 'agent' | 'human' | 'output';
  agent_id?: string;
  description?: string;
}

export interface WorkflowAgent {
  id: string;
  workflow_id: string;
  agent_id: string;
  stage_order: number;
  role_in_workflow: string | null;
  created_at: string;
  agent?: Agent;
}

export interface Deployment {
  id: string;
  target_type: TargetType;
  client_name: string | null;
  environment: HostedInType;
  agent_id: string | null;
  workflow_id: string | null;
  version_label: string;
  go_live_date_planned: string | null;
  go_live_date_actual: string | null;
  rollout_status: RolloutStatusType;
  configuration_notes: string | null;
  integration_depth: IntegrationDepthType;
  created_at: string;
  updated_at: string;
  agent?: Agent;
  workflow?: WorkflowPack;
}

export interface UsageMetrics {
  id: string;
  agent_id: string | null;
  workflow_id: string | null;
  time_window_start: string;
  time_window_end: string;
  total_sessions: number;
  successful_interactions: number;
  failure_count: number;
  avg_interaction_time_seconds: number | null;
  avg_turns: number | null;
  containment_rate: number | null;
  escalation_rate: number | null;
  feedback_count: number;
  correction_count: number;
  north_star_score: number | null;
  data_source: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  agent_id: string | null;
  workflow_id: string | null;
  deployment_id: string | null;
  rating: number | null;
  sentiment: SentimentType | null;
  category: FeedbackCategory;
  comment: string | null;
  created_by: string | null;
  status: FeedbackStatusType;
  created_at: string;
  updated_at: string;
}

export interface Defect {
  id: string;
  agent_id: string | null;
  workflow_id: string | null;
  severity: DefectSeverity;
  environment_impacted: string | null;
  client_impacted: string | null;
  description: string;
  root_cause: RootCauseCategory | null;
  status: string;
  fix_owner: string | null;
  ticket_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectorTool {
  id: string;
  name: string;
  tool_type: ToolType;
  owner_team: string | null;
  notes: string | null;
  reusability_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  problem_statement: string;
  expected_value: string | null;
  required_data: string | null;
  target_accounts: string[];
  decision_status: string;
  priority: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GovernanceGate {
  id: string;
  agent_id: string | null;
  workflow_id: string | null;
  gate_name: string;
  gate_owner: string | null;
  required_artifacts: string[];
  passed: boolean;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ImportHistory {
  id: string;
  file_name: string;
  records_imported: number;
  records_failed: number;
  imported_by: string | null;
  import_notes: string | null;
  created_at: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalAgents: number;
  deployedAgents: number;
  deployableAgents: number;
  inProgressAgents: number;
  agentsByType: Record<AgentType, number>;
  agentsByPlatform: Record<PlatformType, number>;
  agentsByStatus: Record<AgentStatus, number>;
  agentsByHostedIn: Record<HostedInType, number>;
  recentAgents: Agent[];
  topUsedAgents: Array<Agent & { usage: number }>;
  atRiskAgents: Agent[];
}

// Filter types for Library view
export interface AgentFilters {
  search: string;
  status: AgentStatus[];
  platform: PlatformType[];
  hosted_in: HostedInType[];
  agent_type: AgentType[];
  function_domain: FunctionDomainType[];
  owner_team: OwnerTeamType[];
  minRating: number | null;
  minUsage: number | null;
}
