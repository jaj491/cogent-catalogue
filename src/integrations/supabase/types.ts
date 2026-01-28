export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_tools: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          tool_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          tool_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_tools_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "connectors_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          agent_type: Database["public"]["Enums"]["agent_type"]
          can_be_demoed: boolean | null
          can_be_marketed: boolean | null
          completion_percentage: number | null
          created_at: string
          demo_assets: string[] | null
          description: string | null
          documentation_links: string[] | null
          function_domains:
            | Database["public"]["Enums"]["function_domain_type"][]
            | null
          hosted_in: Database["public"]["Enums"]["hosted_in_type"]
          id: string
          name: string
          notes: string | null
          owner_primary: string | null
          owner_team: Database["public"]["Enums"]["owner_team_type"] | null
          platform: Database["public"]["Enums"]["platform_type"]
          status: Database["public"]["Enums"]["agent_status"]
          sub_functions: string[] | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          agent_type?: Database["public"]["Enums"]["agent_type"]
          can_be_demoed?: boolean | null
          can_be_marketed?: boolean | null
          completion_percentage?: number | null
          created_at?: string
          demo_assets?: string[] | null
          description?: string | null
          documentation_links?: string[] | null
          function_domains?:
            | Database["public"]["Enums"]["function_domain_type"][]
            | null
          hosted_in?: Database["public"]["Enums"]["hosted_in_type"]
          id?: string
          name: string
          notes?: string | null
          owner_primary?: string | null
          owner_team?: Database["public"]["Enums"]["owner_team_type"] | null
          platform?: Database["public"]["Enums"]["platform_type"]
          status?: Database["public"]["Enums"]["agent_status"]
          sub_functions?: string[] | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          agent_type?: Database["public"]["Enums"]["agent_type"]
          can_be_demoed?: boolean | null
          can_be_marketed?: boolean | null
          completion_percentage?: number | null
          created_at?: string
          demo_assets?: string[] | null
          description?: string | null
          documentation_links?: string[] | null
          function_domains?:
            | Database["public"]["Enums"]["function_domain_type"][]
            | null
          hosted_in?: Database["public"]["Enums"]["hosted_in_type"]
          id?: string
          name?: string
          notes?: string | null
          owner_primary?: string | null
          owner_team?: Database["public"]["Enums"]["owner_team_type"] | null
          platform?: Database["public"]["Enums"]["platform_type"]
          status?: Database["public"]["Enums"]["agent_status"]
          sub_functions?: string[] | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      connectors_tools: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          owner_team: string | null
          reusability_rating: number | null
          tool_type: Database["public"]["Enums"]["tool_type"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          owner_team?: string | null
          reusability_rating?: number | null
          tool_type?: Database["public"]["Enums"]["tool_type"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          owner_team?: string | null
          reusability_rating?: number | null
          tool_type?: Database["public"]["Enums"]["tool_type"] | null
          updated_at?: string
        }
        Relationships: []
      }
      defects: {
        Row: {
          agent_id: string | null
          client_impacted: string | null
          created_at: string
          description: string
          environment_impacted: string | null
          fix_owner: string | null
          id: string
          root_cause: Database["public"]["Enums"]["root_cause_category"] | null
          severity: Database["public"]["Enums"]["defect_severity"] | null
          status: string | null
          ticket_link: string | null
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          agent_id?: string | null
          client_impacted?: string | null
          created_at?: string
          description: string
          environment_impacted?: string | null
          fix_owner?: string | null
          id?: string
          root_cause?: Database["public"]["Enums"]["root_cause_category"] | null
          severity?: Database["public"]["Enums"]["defect_severity"] | null
          status?: string | null
          ticket_link?: string | null
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          agent_id?: string | null
          client_impacted?: string | null
          created_at?: string
          description?: string
          environment_impacted?: string | null
          fix_owner?: string | null
          id?: string
          root_cause?: Database["public"]["Enums"]["root_cause_category"] | null
          severity?: Database["public"]["Enums"]["defect_severity"] | null
          status?: string | null
          ticket_link?: string | null
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "defects_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defects_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      deployments: {
        Row: {
          agent_id: string | null
          client_name: string | null
          configuration_notes: string | null
          created_at: string
          environment: Database["public"]["Enums"]["hosted_in_type"]
          go_live_date_actual: string | null
          go_live_date_planned: string | null
          id: string
          integration_depth:
            | Database["public"]["Enums"]["integration_depth_type"]
            | null
          rollout_status:
            | Database["public"]["Enums"]["rollout_status_type"]
            | null
          target_type: Database["public"]["Enums"]["target_type"]
          updated_at: string
          version_label: string | null
          workflow_id: string | null
        }
        Insert: {
          agent_id?: string | null
          client_name?: string | null
          configuration_notes?: string | null
          created_at?: string
          environment: Database["public"]["Enums"]["hosted_in_type"]
          go_live_date_actual?: string | null
          go_live_date_planned?: string | null
          id?: string
          integration_depth?:
            | Database["public"]["Enums"]["integration_depth_type"]
            | null
          rollout_status?:
            | Database["public"]["Enums"]["rollout_status_type"]
            | null
          target_type?: Database["public"]["Enums"]["target_type"]
          updated_at?: string
          version_label?: string | null
          workflow_id?: string | null
        }
        Update: {
          agent_id?: string | null
          client_name?: string | null
          configuration_notes?: string | null
          created_at?: string
          environment?: Database["public"]["Enums"]["hosted_in_type"]
          go_live_date_actual?: string | null
          go_live_date_planned?: string | null
          id?: string
          integration_depth?:
            | Database["public"]["Enums"]["integration_depth_type"]
            | null
          rollout_status?:
            | Database["public"]["Enums"]["rollout_status_type"]
            | null
          target_type?: Database["public"]["Enums"]["target_type"]
          updated_at?: string
          version_label?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deployments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployments_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          agent_id: string | null
          category: Database["public"]["Enums"]["feedback_category"] | null
          comment: string | null
          created_at: string
          created_by: string | null
          deployment_id: string | null
          id: string
          rating: number | null
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
          status: Database["public"]["Enums"]["feedback_status"] | null
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          agent_id?: string | null
          category?: Database["public"]["Enums"]["feedback_category"] | null
          comment?: string | null
          created_at?: string
          created_by?: string | null
          deployment_id?: string | null
          id?: string
          rating?: number | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          status?: Database["public"]["Enums"]["feedback_status"] | null
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          agent_id?: string | null
          category?: Database["public"]["Enums"]["feedback_category"] | null
          comment?: string | null
          created_at?: string
          created_by?: string | null
          deployment_id?: string | null
          id?: string
          rating?: number | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          status?: Database["public"]["Enums"]["feedback_status"] | null
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      governance_gates: {
        Row: {
          agent_id: string | null
          completed_at: string | null
          created_at: string
          gate_name: string
          gate_owner: string | null
          id: string
          notes: string | null
          passed: boolean | null
          required_artifacts: string[] | null
          workflow_id: string | null
        }
        Insert: {
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string
          gate_name: string
          gate_owner?: string | null
          id?: string
          notes?: string | null
          passed?: boolean | null
          required_artifacts?: string[] | null
          workflow_id?: string | null
        }
        Update: {
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string
          gate_name?: string
          gate_owner?: string | null
          id?: string
          notes?: string | null
          passed?: boolean | null
          required_artifacts?: string[] | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "governance_gates_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governance_gates_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          created_at: string
          created_by: string | null
          decision_status: string | null
          expected_value: string | null
          id: string
          priority: number | null
          problem_statement: string
          required_data: string | null
          target_accounts: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          decision_status?: string | null
          expected_value?: string | null
          id?: string
          priority?: number | null
          problem_statement: string
          required_data?: string | null
          target_accounts?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          decision_status?: string | null
          expected_value?: string | null
          id?: string
          priority?: number | null
          problem_statement?: string
          required_data?: string | null
          target_accounts?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      import_history: {
        Row: {
          created_at: string
          file_name: string
          id: string
          import_notes: string | null
          imported_by: string | null
          records_failed: number | null
          records_imported: number | null
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          import_notes?: string | null
          imported_by?: string | null
          records_failed?: number | null
          records_imported?: number | null
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          import_notes?: string | null
          imported_by?: string | null
          records_failed?: number | null
          records_imported?: number | null
        }
        Relationships: []
      }
      usage_metrics: {
        Row: {
          agent_id: string | null
          avg_interaction_time_seconds: number | null
          avg_turns: number | null
          containment_rate: number | null
          correction_count: number | null
          created_at: string
          data_source: string | null
          escalation_rate: number | null
          failure_count: number | null
          feedback_count: number | null
          id: string
          north_star_score: number | null
          successful_interactions: number | null
          time_window_end: string
          time_window_start: string
          total_sessions: number | null
          workflow_id: string | null
        }
        Insert: {
          agent_id?: string | null
          avg_interaction_time_seconds?: number | null
          avg_turns?: number | null
          containment_rate?: number | null
          correction_count?: number | null
          created_at?: string
          data_source?: string | null
          escalation_rate?: number | null
          failure_count?: number | null
          feedback_count?: number | null
          id?: string
          north_star_score?: number | null
          successful_interactions?: number | null
          time_window_end: string
          time_window_start: string
          total_sessions?: number | null
          workflow_id?: string | null
        }
        Update: {
          agent_id?: string | null
          avg_interaction_time_seconds?: number | null
          avg_turns?: number | null
          containment_rate?: number | null
          correction_count?: number | null
          created_at?: string
          data_source?: string | null
          escalation_rate?: number | null
          failure_count?: number | null
          feedback_count?: number | null
          id?: string
          north_star_score?: number | null
          successful_interactions?: number | null
          time_window_end?: string
          time_window_start?: string
          total_sessions?: number | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_metrics_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_agents: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          role_in_workflow: string | null
          stage_order: number | null
          workflow_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          role_in_workflow?: string | null
          stage_order?: number | null
          workflow_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          role_in_workflow?: string | null
          stage_order?: number | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_agents_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_packs: {
        Row: {
          business_outcome: string | null
          created_at: string
          description: string | null
          id: string
          maturity: Database["public"]["Enums"]["maturity_type"] | null
          name: string
          orchestrator: string | null
          owners: string[] | null
          problem_statement: string | null
          process_area:
            | Database["public"]["Enums"]["function_domain_type"]
            | null
          reusable_pattern_tags: string[] | null
          smes: string[] | null
          stages: Json | null
          systems: string[] | null
          triggers: string[] | null
          updated_at: string
        }
        Insert: {
          business_outcome?: string | null
          created_at?: string
          description?: string | null
          id?: string
          maturity?: Database["public"]["Enums"]["maturity_type"] | null
          name: string
          orchestrator?: string | null
          owners?: string[] | null
          problem_statement?: string | null
          process_area?:
            | Database["public"]["Enums"]["function_domain_type"]
            | null
          reusable_pattern_tags?: string[] | null
          smes?: string[] | null
          stages?: Json | null
          systems?: string[] | null
          triggers?: string[] | null
          updated_at?: string
        }
        Update: {
          business_outcome?: string | null
          created_at?: string
          description?: string | null
          id?: string
          maturity?: Database["public"]["Enums"]["maturity_type"] | null
          name?: string
          orchestrator?: string | null
          owners?: string[] | null
          problem_statement?: string | null
          process_area?:
            | Database["public"]["Enums"]["function_domain_type"]
            | null
          reusable_pattern_tags?: string[] | null
          smes?: string[] | null
          stages?: Json | null
          systems?: string[] | null
          triggers?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      workflow_tools: {
        Row: {
          created_at: string
          id: string
          tool_id: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tool_id: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tool_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "connectors_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_tools_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      agent_status:
        | "Ideation"
        | "In Progress"
        | "UAT"
        | "Governance Review"
        | "Deployable"
        | "Deployed"
        | "Archived"
      agent_type:
        | "General"
        | "Sourcing"
        | "Contracting"
        | "PR2PO"
        | "AP"
        | "Compliance"
      app_role: "viewer" | "account_lead" | "agent_owner" | "admin"
      defect_severity: "Critical" | "High" | "Medium" | "Low"
      feedback_category:
        | "Accuracy"
        | "Usefulness"
        | "UX"
        | "Integration"
        | "Policy/Compliance"
        | "Other"
      feedback_status: "New" | "Triaged" | "In Fix" | "Resolved" | "Wont Fix"
      function_domain_type:
        | "S2C"
        | "P2P"
        | "AP"
        | "SCM"
        | "MDM"
        | "Consulting"
        | "FHV"
      hosted_in_type:
        | "GEP AI Agent Library"
        | "Internal Domain"
        | "Client Domain"
        | "Client Environment"
      integration_depth_type:
        | "None"
        | "Minimal"
        | "Standard connectors"
        | "Custom APIs"
      maturity_type: "Prototype" | "Pilot" | "Production"
      owner_team_type:
        | "Digital COE"
        | "Account"
        | "Central AI Services"
        | "AI Agent Champions"
        | "Other"
      platform_type:
        | "Quantum Studio"
        | "Quantum Platform"
        | "Google Agentspace"
        | "Microsoft Co-Pilot Studio"
        | "Others"
      rollout_status_type:
        | "Planned"
        | "In UAT"
        | "Live"
        | "Paused"
        | "Decommissioned"
      root_cause_category:
        | "Prompt"
        | "Data"
        | "Connector"
        | "Model"
        | "Access"
        | "Policy"
        | "Other"
      sentiment_type: "positive" | "negative"
      target_type: "Internal" | "Client"
      tool_type:
        | "API"
        | "Connector"
        | "MCP endpoint"
        | "Script"
        | "RPA"
        | "Database"
        | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: [
        "Ideation",
        "In Progress",
        "UAT",
        "Governance Review",
        "Deployable",
        "Deployed",
        "Archived",
      ],
      agent_type: [
        "General",
        "Sourcing",
        "Contracting",
        "PR2PO",
        "AP",
        "Compliance",
      ],
      app_role: ["viewer", "account_lead", "agent_owner", "admin"],
      defect_severity: ["Critical", "High", "Medium", "Low"],
      feedback_category: [
        "Accuracy",
        "Usefulness",
        "UX",
        "Integration",
        "Policy/Compliance",
        "Other",
      ],
      feedback_status: ["New", "Triaged", "In Fix", "Resolved", "Wont Fix"],
      function_domain_type: [
        "S2C",
        "P2P",
        "AP",
        "SCM",
        "MDM",
        "Consulting",
        "FHV",
      ],
      hosted_in_type: [
        "GEP AI Agent Library",
        "Internal Domain",
        "Client Domain",
        "Client Environment",
      ],
      integration_depth_type: [
        "None",
        "Minimal",
        "Standard connectors",
        "Custom APIs",
      ],
      maturity_type: ["Prototype", "Pilot", "Production"],
      owner_team_type: [
        "Digital COE",
        "Account",
        "Central AI Services",
        "AI Agent Champions",
        "Other",
      ],
      platform_type: [
        "Quantum Studio",
        "Quantum Platform",
        "Google Agentspace",
        "Microsoft Co-Pilot Studio",
        "Others",
      ],
      rollout_status_type: [
        "Planned",
        "In UAT",
        "Live",
        "Paused",
        "Decommissioned",
      ],
      root_cause_category: [
        "Prompt",
        "Data",
        "Connector",
        "Model",
        "Access",
        "Policy",
        "Other",
      ],
      sentiment_type: ["positive", "negative"],
      target_type: ["Internal", "Client"],
      tool_type: [
        "API",
        "Connector",
        "MCP endpoint",
        "Script",
        "RPA",
        "Database",
        "Other",
      ],
    },
  },
} as const
