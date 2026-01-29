import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Gap, type GapMatch, useGapMatches, useCreateGapMatches, useUpdateGap } from '@/hooks/useGaps';
import { useAgents } from '@/hooks/useAgents';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useToolsRegistryStats } from '@/hooks/useToolsRegistry';
import { Bot, Workflow, Puzzle, ArrowRight, CheckCircle2, XCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface GapAnalysisResultsProps {
  gap: Gap;
}

export function GapAnalysisResults({ gap }: GapAnalysisResultsProps) {
  const navigate = useNavigate();
  const { data: matches, isLoading: matchesLoading } = useGapMatches(gap.id);
  const { data: agents } = useAgents();
  const { data: workflows } = useWorkflows();
  const { data: skills } = useToolsRegistryStats();
  const createMatches = useCreateGapMatches();
  const updateGap = useUpdateGap();

  // Auto-generate matches if none exist
  useEffect(() => {
    if (!matchesLoading && matches?.length === 0 && agents && workflows && skills?.skills) {
      generateMatches();
    }
  }, [matchesLoading, matches, agents, workflows, skills]);

  const generateMatches = async () => {
    if (!agents || !workflows || !skills?.skills) return;

    const newMatches: any[] = [];
    const gapText = `${gap.title} ${gap.problem_statement} ${gap.desired_outcome || ''}`.toLowerCase();
    const gapSubFunctions = gap.sub_functions || [];

    // Match agents
    agents.forEach(agent => {
      const agentText = `${agent.name} ${agent.description || ''} ${(agent.sub_functions || []).join(' ')}`.toLowerCase();
      const processMatch = agent.function_domains?.includes(gap.process_area as any);
      const subFunctionMatch = (agent.sub_functions || []).some(sf => 
        gapSubFunctions.some(gsf => sf.toLowerCase().includes(gsf.toLowerCase()))
      );
      const textMatch = gapSubFunctions.some(sf => agentText.includes(sf.toLowerCase()));

      let score = 0;
      if (processMatch) score += 0.3;
      if (subFunctionMatch) score += 0.4;
      if (textMatch) score += 0.3;

      if (score >= 0.3) {
        newMatches.push({
          gap_id: gap.id,
          match_type: 'agent' as const,
          agent_id: agent.id,
          relevance_score: Math.min(score, 0.99),
          suggested_action: score >= 0.7 ? 'Reuse' : score >= 0.5 ? 'Extend' : 'Partial Fit',
        });
      }
    });

    // Match workflows
    workflows.forEach(workflow => {
      const workflowText = `${workflow.name} ${workflow.description || ''} ${workflow.business_outcome || ''}`.toLowerCase();
      const processMatch = workflow.process_area === gap.process_area;
      const textMatch = gapSubFunctions.some(sf => workflowText.includes(sf.toLowerCase()));

      let score = 0;
      if (processMatch) score += 0.4;
      if (textMatch) score += 0.4;

      if (score >= 0.3) {
        newMatches.push({
          gap_id: gap.id,
          match_type: 'workflow' as const,
          workflow_id: workflow.id,
          relevance_score: Math.min(score, 0.99),
          suggested_action: score >= 0.7 ? 'Reuse' : score >= 0.5 ? 'Extend' : 'Partial Fit',
        });
      }
    });

    // Match skills and identify gaps
    const requiredSkillKeywords = gapSubFunctions.map(sf => sf.toLowerCase());
    skills.skills.forEach(skill => {
      const skillText = `${skill.name} ${skill.description || ''}`.toLowerCase();
      const match = requiredSkillKeywords.some(kw => skillText.includes(kw));

      if (match) {
        newMatches.push({
          gap_id: gap.id,
          match_type: 'skill' as const,
          skill_id: skill.id,
          relevance_score: 0.8,
          suggested_action: skill.status === 'Approved' ? 'Reuse' : 'Extend',
          gap_reason: skill.status === 'Deprecated' ? 'Skill is deprecated' : null,
        });
      }
    });

    if (newMatches.length > 0) {
      await createMatches.mutateAsync(newMatches);
    }

    // Generate recommendation
    const agentMatches = newMatches.filter(m => m.match_type === 'agent');
    const highScoreMatches = agentMatches.filter(m => m.relevance_score >= 0.7);
    
    let recommendation = '';
    if (highScoreMatches.length > 0) {
      recommendation = `Reuse existing agent — ${highScoreMatches.length} agent(s) closely match this need with ${Math.round(highScoreMatches[0].relevance_score * 100)}% relevance.`;
    } else if (agentMatches.length > 0) {
      recommendation = `Extend existing agent — ${Math.round(agentMatches[0].relevance_score * 100)}% of required capabilities exist, but customization may be needed.`;
    } else if (newMatches.some(m => m.match_type === 'skill')) {
      recommendation = 'Build new agent — Required skills exist, but no agent combines them for this use case.';
    } else {
      recommendation = 'Discovery required — No strong matches found. Further analysis recommended.';
    }

    await updateGap.mutateAsync({ id: gap.id, recommended_path: recommendation });
  };

  const agentMatches = matches?.filter(m => m.match_type === 'agent') || [];
  const workflowMatches = matches?.filter(m => m.match_type === 'workflow') || [];
  const skillMatches = matches?.filter(m => m.match_type === 'skill') || [];

  const getActionBadgeVariant = (action: string | null) => {
    switch (action) {
      case 'Reuse': return 'default';
      case 'Extend': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gap Analysis Results</h1>
        <p className="text-muted-foreground">
          Here's how this opportunity maps to our existing assets.
        </p>
      </div>

      {/* Gap Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{gap.title}</CardTitle>
          <CardDescription>{gap.problem_statement}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          {gap.process_area && <Badge variant="outline">{gap.process_area}</Badge>}
          {gap.urgency && <Badge variant={gap.urgency === 'High' ? 'destructive' : 'secondary'}>{gap.urgency} Urgency</Badge>}
          {gap.status && <Badge>{gap.status}</Badge>}
        </CardContent>
      </Card>

      {/* Recommendation Panel */}
      {gap.recommended_path && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Recommended Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{gap.recommended_path}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This recommendation is advisory — final decision remains with the team.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Agent Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Relevant Agents
          </CardTitle>
          <CardDescription>
            Agents ranked by relevance based on process area, sub-function, and description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agentMatches.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No strong agent matches found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {agentMatches.map((match: any) => (
                <Card key={match.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/library/${match.agent?.id}`)}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{match.agent?.name}</h4>
                      <Badge variant={getActionBadgeVariant(match.suggested_action)}>
                        {match.suggested_action}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {match.agent?.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Relevance:</span>
                      <Progress value={Number(match.relevance_score) * 100} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{Math.round(Number(match.relevance_score) * 100)}%</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{match.agent?.status}</Badge>
                      <Badge variant="outline" className="text-xs">{match.agent?.platform}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Relevant Workflow Packs
          </CardTitle>
          <CardDescription>
            End-to-end workflows that may already address part or all of this need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflowMatches.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No workflow packs match this gap yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {workflowMatches.map((match: any) => (
                <Card key={match.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/workflows/${match.workflow?.id}`)}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{match.workflow?.name}</h4>
                      <Badge variant={getActionBadgeVariant(match.suggested_action)}>
                        {match.suggested_action}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {match.workflow?.business_outcome}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Relevance:</span>
                      <Progress value={Number(match.relevance_score) * 100} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{Math.round(Number(match.relevance_score) * 100)}%</span>
                    </div>
                    <Badge variant="outline" className="text-xs mt-2">{match.workflow?.maturity}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skill Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Skill Coverage & Gaps
          </CardTitle>
          <CardDescription>
            Required capabilities inferred from the gap description and classification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skillMatches.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Complete classification to see matching skills.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Exists?</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gap Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skillMatches.map((match: any) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-medium">{match.skill?.name}</TableCell>
                    <TableCell>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </TableCell>
                    <TableCell>
                      <Badge variant={match.skill?.status === 'Approved' ? 'default' : 'secondary'}>
                        {match.skill?.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {match.gap_reason || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button onClick={() => navigate(`/ideas/${gap.id}/decision`)}>
          Proceed to Decision
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
