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
      agent_aliases: {
        Row: {
          agent_id: string
          alias_name: string
          created_at: string
          created_by: string | null
          id: string
        }
        Insert: {
          agent_id: string
          alias_name: string
          created_at?: string
          created_by?: string | null
          id?: string
        }
        Update: {
          agent_id?: string
          alias_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_aliases_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_skills: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          is_required: boolean | null
          notes: string | null
          skill_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          is_required?: boolean | null
          notes?: string | null
          skill_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          is_required?: boolean | null
          notes?: string | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_skills_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
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
      endpoints: {
        Row: {
          created_at: string
          endpoint_reference: string | null
          environment: Database["public"]["Enums"]["environment_type"] | null
          execution_lane: Database["public"]["Enums"]["execution_lane"]
          health_status: Database["public"]["Enums"]["health_status"] | null
          id: string
          implementation_type: Database["public"]["Enums"]["implementation_type"]
          last_tested_at: string | null
          name: string
          observability:
            | Database["public"]["Enums"]["observability_type"]
            | null
          skill_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          endpoint_reference?: string | null
          environment?: Database["public"]["Enums"]["environment_type"] | null
          execution_lane: Database["public"]["Enums"]["execution_lane"]
          health_status?: Database["public"]["Enums"]["health_status"] | null
          id?: string
          implementation_type: Database["public"]["Enums"]["implementation_type"]
          last_tested_at?: string | null
          name: string
          observability?:
            | Database["public"]["Enums"]["observability_type"]
            | null
          skill_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          endpoint_reference?: string | null
          environment?: Database["public"]["Enums"]["environment_type"] | null
          execution_lane?: Database["public"]["Enums"]["execution_lane"]
          health_status?: Database["public"]["Enums"]["health_status"] | null
          id?: string
          implementation_type?: Database["public"]["Enums"]["implementation_type"]
          last_tested_at?: string | null
          name?: string
          observability?:
            | Database["public"]["Enums"]["observability_type"]
            | null
          skill_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "endpoints_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
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
      gap_matches: {
        Row: {
          agent_id: string | null
          created_at: string
          gap_id: string
          gap_reason: string | null
          id: string
          match_type: Database["public"]["Enums"]["match_type"]
          relevance_score: number | null
          skill_id: string | null
          suggested_action:
            | Database["public"]["Enums"]["suggested_action"]
            | null
          workflow_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          gap_id: string
          gap_reason?: string | null
          id?: string
          match_type: Database["public"]["Enums"]["match_type"]
          relevance_score?: number | null
          skill_id?: string | null
          suggested_action?:
            | Database["public"]["Enums"]["suggested_action"]
            | null
          workflow_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          gap_id?: string
          gap_reason?: string | null
          id?: string
          match_type?: Database["public"]["Enums"]["match_type"]
          relevance_score?: number | null
          skill_id?: string | null
          suggested_action?:
            | Database["public"]["Enums"]["suggested_action"]
            | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gap_matches_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gap_matches_gap_id_fkey"
            columns: ["gap_id"]
            isOneToOne: false
            referencedRelation: "gaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gap_matches_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gap_matches_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      gaps: {
        Row: {
          created_at: string
          created_by: string | null
          decision: Database["public"]["Enums"]["gap_decision"] | null
          decision_owner: string | null
          decision_rationale: string | null
          desired_outcome: string | null
          estimated_impact: Database["public"]["Enums"]["impact_level"] | null
          id: string
          linked_artifact_id: string | null
          linked_artifact_type: string | null
          next_steps: string | null
          problem_statement: string
          process_area:
            | Database["public"]["Enums"]["function_domain_type"]
            | null
          recommended_path: string | null
          status: Database["public"]["Enums"]["gap_status"] | null
          sub_functions: string[] | null
          target_clients: string[] | null
          title: string
          triggering_context: Database["public"]["Enums"]["gap_trigger"] | null
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"] | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          decision?: Database["public"]["Enums"]["gap_decision"] | null
          decision_owner?: string | null
          decision_rationale?: string | null
          desired_outcome?: string | null
          estimated_impact?: Database["public"]["Enums"]["impact_level"] | null
          id?: string
          linked_artifact_id?: string | null
          linked_artifact_type?: string | null
          next_steps?: string | null
          problem_statement: string
          process_area?:
            | Database["public"]["Enums"]["function_domain_type"]
            | null
          recommended_path?: string | null
          status?: Database["public"]["Enums"]["gap_status"] | null
          sub_functions?: string[] | null
          target_clients?: string[] | null
          title: string
          triggering_context?: Database["public"]["Enums"]["gap_trigger"] | null
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          decision?: Database["public"]["Enums"]["gap_decision"] | null
          decision_owner?: string | null
          decision_rationale?: string | null
          desired_outcome?: string | null
          estimated_impact?: Database["public"]["Enums"]["impact_level"] | null
          id?: string
          linked_artifact_id?: string | null
          linked_artifact_type?: string | null
          next_steps?: string | null
          problem_statement?: string
          process_area?:
            | Database["public"]["Enums"]["function_domain_type"]
            | null
          recommended_path?: string | null
          status?: Database["public"]["Enums"]["gap_status"] | null
          sub_functions?: string[] | null
          target_clients?: string[] | null
          title?: string
          triggering_context?: Database["public"]["Enums"]["gap_trigger"] | null
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
        }
        Relationships: []
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
      skills: {
        Row: {
          capability_category: Database["public"]["Enums"]["capability_category"]
          created_at: string
          description: string | null
          id: string
          inputs: string | null
          name: string
          outputs: string | null
          owner: string | null
          reusability_rating: number | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          status: Database["public"]["Enums"]["skill_status"] | null
          tool_id: string | null
          updated_at: string
        }
        Insert: {
          capability_category: Database["public"]["Enums"]["capability_category"]
          created_at?: string
          description?: string | null
          id?: string
          inputs?: string | null
          name: string
          outputs?: string | null
          owner?: string | null
          reusability_rating?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          status?: Database["public"]["Enums"]["skill_status"] | null
          tool_id?: string | null
          updated_at?: string
        }
        Update: {
          capability_category?: Database["public"]["Enums"]["capability_category"]
          created_at?: string
          description?: string | null
          id?: string
          inputs?: string | null
          name?: string
          outputs?: string | null
          owner?: string | null
          reusability_rating?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          status?: Database["public"]["Enums"]["skill_status"] | null
          tool_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          auth_method: Database["public"]["Enums"]["auth_method"] | null
          created_at: string
          data_sensitivity:
            | Database["public"]["Enums"]["data_sensitivity"]
            | null
          id: string
          name: string
          notes: string | null
          owner_team: string | null
          supported_lanes:
            | Database["public"]["Enums"]["execution_lane"][]
            | null
          system_type: Database["public"]["Enums"]["system_type"]
          updated_at: string
          vendor: string | null
        }
        Insert: {
          auth_method?: Database["public"]["Enums"]["auth_method"] | null
          created_at?: string
          data_sensitivity?:
            | Database["public"]["Enums"]["data_sensitivity"]
            | null
          id?: string
          name: string
          notes?: string | null
          owner_team?: string | null
          supported_lanes?:
            | Database["public"]["Enums"]["execution_lane"][]
            | null
          system_type: Database["public"]["Enums"]["system_type"]
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          auth_method?: Database["public"]["Enums"]["auth_method"] | null
          created_at?: string
          data_sensitivity?:
            | Database["public"]["Enums"]["data_sensitivity"]
            | null
          id?: string
          name?: string
          notes?: string | null
          owner_team?: string | null
          supported_lanes?:
            | Database["public"]["Enums"]["execution_lane"][]
            | null
          system_type?: Database["public"]["Enums"]["system_type"]
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      unmatched_usage_rows: {
        Row: {
          account: string
          agent_name: string
          created_at: string
          data_source: string
          id: string
          match_confidence: string | null
          metric: string
          notes: string | null
          raw_agent_slug: string | null
          resolved: boolean
          resolved_agent_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          time_window_end: string
          time_window_start: string
          value: number
        }
        Insert: {
          account: string
          agent_name: string
          created_at?: string
          data_source?: string
          id?: string
          match_confidence?: string | null
          metric?: string
          notes?: string | null
          raw_agent_slug?: string | null
          resolved?: boolean
          resolved_agent_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          time_window_end: string
          time_window_start: string
          value?: number
        }
        Update: {
          account?: string
          agent_name?: string
          created_at?: string
          data_source?: string
          id?: string
          match_confidence?: string | null
          metric?: string
          notes?: string | null
          raw_agent_slug?: string | null
          resolved?: boolean
          resolved_agent_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          time_window_end?: string
          time_window_start?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "unmatched_usage_rows_resolved_agent_id_fkey"
            columns: ["resolved_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
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
      usage_metrics_snapshot: {
        Row: {
          account: string
          agent_id: string | null
          agent_name: string | null
          created_at: string
          data_source: string
          id: string
          match_confidence: string | null
          metric: string
          notes: string | null
          raw_agent_slug: string | null
          time_window_end: string
          time_window_start: string
          value: number
        }
        Insert: {
          account: string
          agent_id?: string | null
          agent_name?: string | null
          created_at?: string
          data_source?: string
          id?: string
          match_confidence?: string | null
          metric?: string
          notes?: string | null
          raw_agent_slug?: string | null
          time_window_end: string
          time_window_start: string
          value?: number
        }
        Update: {
          account?: string
          agent_id?: string | null
          agent_name?: string | null
          created_at?: string
          data_source?: string
          id?: string
          match_confidence?: string | null
          metric?: string
          notes?: string | null
          raw_agent_slug?: string | null
          time_window_end?: string
          time_window_start?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_snapshot_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
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
      workflow_skills: {
        Row: {
          created_at: string
          id: string
          is_required: boolean | null
          skill_id: string
          stage_in_workflow: string | null
          workflow_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean | null
          skill_id: string
          stage_in_workflow?: string | null
          workflow_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean | null
          skill_id?: string
          stage_in_workflow?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_skills_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_packs"
            referencedColumns: ["id"]
          },
        ]
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
      auth_method: "OAuth" | "SSO/SAML" | "API Key" | "Service Principal"
      capability_category:
        | "Read"
        | "Write"
        | "Approve"
        | "Search"
        | "Extract"
        | "Generate"
        | "Compare"
      data_sensitivity: "Low" | "Medium" | "High"
      defect_severity: "Critical" | "High" | "Medium" | "Low"
      environment_type: "Dev" | "Test" | "Prod"
      execution_lane: "Quantum" | "Azure" | "GCP"
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
      gap_decision:
        | "Reuse existing agent"
        | "Extend existing agent or workflow"
        | "Build new agent"
        | "Discovery required"
      gap_status: "New" | "In Review" | "Decision Made" | "In Build" | "Closed"
      gap_trigger:
        | "Client request"
        | "Sales pursuit"
        | "Delivery pain point"
        | "Internal innovation"
        | "Platform limitation"
      health_status: "Healthy" | "Degraded" | "At Risk"
      hosted_in_type:
        | "GEP AI Agent Library"
        | "Internal Domain"
        | "Client Domain"
        | "Client Environment"
      impact_level: "Low" | "Medium" | "High"
      implementation_type:
        | "Qi Function"
        | "Power Automate"
        | "REST API"
        | "MCP Tool"
        | "Cloud Function"
      integration_depth_type:
        | "None"
        | "Minimal"
        | "Standard connectors"
        | "Custom APIs"
      match_type: "agent" | "workflow" | "skill"
      maturity_type: "Prototype" | "Pilot" | "Production"
      observability_type: "Langfuse" | "Other" | "None"
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
      risk_level: "Low" | "Medium" | "High"
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
      skill_status: "Draft" | "Approved" | "Deprecated"
      suggested_action: "Reuse" | "Extend" | "Partial Fit"
      system_type:
        | "ERP"
        | "CLM"
        | "P2P"
        | "Intake"
        | "Collaboration"
        | "Data"
        | "AI"
        | "RPA"
      target_type: "Internal" | "Client"
      tool_type:
        | "API"
        | "Connector"
        | "MCP endpoint"
        | "Script"
        | "RPA"
        | "Database"
        | "Other"
      urgency_level: "Low" | "Medium" | "High"
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
      auth_method: ["OAuth", "SSO/SAML", "API Key", "Service Principal"],
      capability_category: [
        "Read",
        "Write",
        "Approve",
        "Search",
        "Extract",
        "Generate",
        "Compare",
      ],
      data_sensitivity: ["Low", "Medium", "High"],
      defect_severity: ["Critical", "High", "Medium", "Low"],
      environment_type: ["Dev", "Test", "Prod"],
      execution_lane: ["Quantum", "Azure", "GCP"],
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
      gap_decision: [
        "Reuse existing agent",
        "Extend existing agent or workflow",
        "Build new agent",
        "Discovery required",
      ],
      gap_status: ["New", "In Review", "Decision Made", "In Build", "Closed"],
      gap_trigger: [
        "Client request",
        "Sales pursuit",
        "Delivery pain point",
        "Internal innovation",
        "Platform limitation",
      ],
      health_status: ["Healthy", "Degraded", "At Risk"],
      hosted_in_type: [
        "GEP AI Agent Library",
        "Internal Domain",
        "Client Domain",
        "Client Environment",
      ],
      impact_level: ["Low", "Medium", "High"],
      implementation_type: [
        "Qi Function",
        "Power Automate",
        "REST API",
        "MCP Tool",
        "Cloud Function",
      ],
      integration_depth_type: [
        "None",
        "Minimal",
        "Standard connectors",
        "Custom APIs",
      ],
      match_type: ["agent", "workflow", "skill"],
      maturity_type: ["Prototype", "Pilot", "Production"],
      observability_type: ["Langfuse", "Other", "None"],
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
      risk_level: ["Low", "Medium", "High"],
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
      skill_status: ["Draft", "Approved", "Deprecated"],
      suggested_action: ["Reuse", "Extend", "Partial Fit"],
      system_type: [
        "ERP",
        "CLM",
        "P2P",
        "Intake",
        "Collaboration",
        "Data",
        "AI",
        "RPA",
      ],
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
      urgency_level: ["Low", "Medium", "High"],
    },
  },
} as const
