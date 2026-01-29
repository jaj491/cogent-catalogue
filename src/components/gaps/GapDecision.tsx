import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { type Gap, useUpdateGap } from '@/hooks/useGaps';
import { toast } from 'sonner';
import { Lightbulb, Save, Link2, ArrowLeft } from 'lucide-react';

const DECISIONS = [
  { value: 'Reuse existing agent', label: 'Reuse existing agent' },
  { value: 'Extend existing agent or workflow', label: 'Extend existing agent or workflow' },
  { value: 'Build new agent', label: 'Build new agent' },
  { value: 'Discovery required', label: 'Discovery required' },
];

const decisionSchema = z.object({
  decision: z.enum(['Reuse existing agent', 'Extend existing agent or workflow', 'Build new agent', 'Discovery required']),
  decision_rationale: z.string().min(1, 'Please provide a rationale').max(1000, 'Rationale must be less than 1000 characters'),
  decision_owner: z.string().min(1, 'Please specify the decision owner').max(100, 'Owner name must be less than 100 characters'),
  next_steps: z.string().max(1000, 'Next steps must be less than 1000 characters').optional(),
});

type DecisionFormData = z.infer<typeof decisionSchema>;

interface GapDecisionProps {
  gap: Gap;
}

export function GapDecision({ gap }: GapDecisionProps) {
  const navigate = useNavigate();
  const updateGap = useUpdateGap();

  const form = useForm<DecisionFormData>({
    resolver: zodResolver(decisionSchema),
    defaultValues: {
      decision: gap.decision || undefined,
      decision_rationale: gap.decision_rationale || '',
      decision_owner: gap.decision_owner || '',
      next_steps: gap.next_steps || '',
    },
  });

  const onSubmit = async (data: DecisionFormData) => {
    try {
      await updateGap.mutateAsync({
        id: gap.id,
        ...data,
        status: 'Decision Made',
      });
      toast.success('Decision saved successfully!');
      navigate('/ideas');
    } catch (error) {
      toast.error('Failed to save decision');
      console.error(error);
    }
  };

  const handleCreateArtifact = async () => {
    const decision = form.getValues('decision');
    
    // First save the decision
    try {
      await updateGap.mutateAsync({
        id: gap.id,
        ...form.getValues(),
        status: 'In Build',
      });
      
      toast.success('Decision saved. Redirecting to create artifact...');
      
      // Navigate based on decision type
      if (decision === 'Reuse existing agent') {
        navigate('/deployments');
      } else if (decision === 'Build new agent') {
        navigate('/library');
      } else {
        navigate('/workflows');
      }
    } catch (error) {
      toast.error('Failed to save decision');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Decision & Next Steps</h1>
        <p className="text-muted-foreground">
          Finalize the path forward for this opportunity.
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
        </CardContent>
      </Card>

      {/* System Recommendation */}
      {gap.recommended_path && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              System Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{gap.recommended_path}</p>
          </CardContent>
        </Card>
      )}

      {/* Decision Form */}
      <Card>
        <CardHeader>
          <CardTitle>Record Your Decision</CardTitle>
          <CardDescription>
            Document the path forward and assign ownership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="decision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a decision" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DECISIONS.map(d => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decision_rationale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why are we taking this path?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Capture the reasoning for future reference and governance."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decision_owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter owner name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="next_steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Steps</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What happens next? (e.g., create agent stub, extend workflow, schedule discovery)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Document the immediate actions required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/ideas/${gap.id}/analysis`)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Analysis
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCreateArtifact}
                    disabled={!form.watch('decision')}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    Create Linked Artifact
                  </Button>
                  <Button type="submit" disabled={updateGap.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {updateGap.isPending ? 'Saving...' : 'Save Decision'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
