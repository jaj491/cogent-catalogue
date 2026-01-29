import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateGap, type GapInsert } from '@/hooks/useGaps';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const PROCESS_AREAS = [
  { value: 'S2C', label: 'Source to Contract (S2C)' },
  { value: 'P2P', label: 'Procure to Pay (P2P)' },
  { value: 'AP', label: 'Accounts Payable (AP)' },
  { value: 'SCM', label: 'Supply Chain / Planning' },
  { value: 'MDM', label: 'Master Data / MDM' },
  { value: 'Consulting', label: 'Consulting / Insights' },
  { value: 'FHV', label: 'FHV / Integrator' },
];

const SUB_FUNCTIONS = [
  'PR Validation', 'RFx Creation', 'Contract Review', 'Supplier Onboarding',
  'Invoice Processing', 'PO Management', 'Spend Analysis', 'Catalog Management',
  'Approval Workflows', 'Compliance Check', 'Risk Assessment', 'Data Enrichment',
];

const TRIGGERS = [
  { value: 'Client request', label: 'Client request' },
  { value: 'Sales pursuit', label: 'Sales pursuit' },
  { value: 'Delivery pain point', label: 'Delivery pain point' },
  { value: 'Internal innovation', label: 'Internal innovation' },
  { value: 'Platform limitation', label: 'Platform limitation' },
];

const step1Schema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  problem_statement: z.string().min(1, 'Problem statement is required').max(1000, 'Problem statement must be less than 1000 characters'),
  desired_outcome: z.string().max(1000, 'Desired outcome must be less than 1000 characters').optional(),
});

const step2Schema = z.object({
  process_area: z.enum(['S2C', 'P2P', 'AP', 'SCM', 'MDM', 'Consulting', 'FHV']).optional(),
  sub_functions: z.array(z.string()).default([]),
  triggering_context: z.enum(['Client request', 'Sales pursuit', 'Delivery pain point', 'Internal innovation', 'Platform limitation']).optional(),
  target_clients: z.array(z.string()).default([]),
  urgency: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  estimated_impact: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

interface GapIntakeWizardProps {
  onClose: () => void;
}

export function GapIntakeWizard({ onClose }: GapIntakeWizardProps) {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [newClient, setNewClient] = useState('');
  const navigate = useNavigate();
  const createGap = useCreateGap();

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      title: '',
      problem_statement: '',
      desired_outcome: '',
    },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      process_area: undefined,
      sub_functions: [],
      triggering_context: undefined,
      target_clients: [],
      urgency: 'Medium',
      estimated_impact: 'Medium',
    },
  });

  const handleStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleStep2Submit = async (data: Step2Data) => {
    if (!step1Data) return;

    const gapData: GapInsert = {
      title: step1Data.title,
      problem_statement: step1Data.problem_statement,
      desired_outcome: step1Data.desired_outcome,
      process_area: data.process_area,
      sub_functions: data.sub_functions,
      triggering_context: data.triggering_context,
      target_clients: data.target_clients,
      urgency: data.urgency,
      estimated_impact: data.estimated_impact,
      status: 'New',
    };

    try {
      const newGap = await createGap.mutateAsync(gapData);
      toast.success('Gap submitted successfully!');
      onClose();
      navigate(`/ideas/${newGap.id}/analysis`);
    } catch (error) {
      toast.error('Failed to submit gap');
      console.error(error);
    }
  };

  const addClient = () => {
    if (newClient.trim()) {
      const current = form2.getValues('target_clients');
      if (!current.includes(newClient.trim())) {
        form2.setValue('target_clients', [...current, newClient.trim()]);
      }
      setNewClient('');
    }
  };

  const removeClient = (client: string) => {
    const current = form2.getValues('target_clients');
    form2.setValue('target_clients', current.filter(c => c !== client));
  };

  const toggleSubFunction = (sf: string) => {
    const current = form2.getValues('sub_functions');
    if (current.includes(sf)) {
      form2.setValue('sub_functions', current.filter(s => s !== sf));
    } else {
      form2.setValue('sub_functions', [...current, sf]);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Submit a New Gap</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Step {step} of 2 — {step === 1 ? 'Describe the Need' : 'Classify the Gap'}
        </p>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <Form {...form1}>
            <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="space-y-6">
              <FormField
                control={form1.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Short, business-friendly name (e.g., 'Automated PR Validation for Tail Spend')" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This should describe the outcome, not the solution.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form1.control}
                name="problem_statement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What problem are we trying to solve?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the business problem or pain point in plain language."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Focus on the business issue — not a specific tool or agent.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form1.control}
                name="desired_outcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What does success look like?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What should be faster, cheaper, more accurate, or more scalable?"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This helps the system identify relevant agents, workflows, and skills.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Next → Classify the Gap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...form2}>
            <form onSubmit={form2.handleSubmit(handleStep2Submit)} className="space-y-6">
              <FormField
                control={form2.control}
                name="process_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Process Area</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select process area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROCESS_AREAS.map(area => (
                          <SelectItem key={area.value} value={area.value}>
                            {area.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the primary process where this gap occurs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form2.control}
                name="sub_functions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Function(s)</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {SUB_FUNCTIONS.map(sf => (
                        <Badge
                          key={sf}
                          variant={field.value.includes(sf) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleSubFunction(sf)}
                        >
                          {sf}
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>
                      Used to match against existing agents and workflow packs.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form2.control}
                name="triggering_context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why is this coming up now?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRIGGERS.map(trigger => (
                          <SelectItem key={trigger.value} value={trigger.value}>
                            {trigger.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form2.control}
                name="target_clients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Client(s)</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add client name..."
                        value={newClient}
                        onChange={(e) => setNewClient(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addClient();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addClient}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map(client => (
                        <Badge key={client} variant="secondary" className="gap-1">
                          {client}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeClient(client)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>
                      Optional — add one or more clients, or leave blank if cross-client.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form2.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency</FormLabel>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        {['Low', 'Medium', 'High'].map(level => (
                          <div key={level} className="flex items-center space-x-2">
                            <RadioGroupItem value={level} id={`urgency-${level}`} />
                            <Label htmlFor={`urgency-${level}`}>{level}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form2.control}
                  name="estimated_impact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Business Impact</FormLabel>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        {['Low', 'Medium', 'High'].map(level => (
                          <div key={level} className="flex items-center space-x-2">
                            <RadioGroupItem value={level} id={`impact-${level}`} />
                            <Label htmlFor={`impact-${level}`}>{level}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <FormDescription>
                        Directional is fine — this is not a financial model.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" disabled={createGap.isPending}>
                  {createGap.isPending ? 'Submitting...' : 'Submit Gap'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
